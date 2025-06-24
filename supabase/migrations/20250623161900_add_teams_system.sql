-- Create teams table
CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "avatar_url" text,
    "settings" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "created_by" uuid,
    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- Create team_member_roles enum
CREATE TYPE team_member_role AS ENUM ('admin', 'regular', 'viewer');

-- Create team_members table
CREATE TABLE IF NOT EXISTS "public"."team_members" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "team_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "role" team_member_role DEFAULT 'regular' NOT NULL,
    "joined_at" timestamp with time zone DEFAULT now() NOT NULL,
    "invited_by" uuid,
    "is_active" boolean DEFAULT true NOT NULL,
    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "team_members_team_user_unique" UNIQUE ("team_id", "user_id")
);

-- Add team_id to profiles table
ALTER TABLE "public"."profiles" 
ADD COLUMN "team_id" uuid;

-- Create foreign key constraints
ALTER TABLE "public"."teams"
ADD CONSTRAINT "teams_created_by_fkey" 
FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;

ALTER TABLE "public"."team_members"
ADD CONSTRAINT "team_members_team_id_fkey" 
FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;

ALTER TABLE "public"."team_members"
ADD CONSTRAINT "team_members_user_id_fkey" 
FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE "public"."team_members"
ADD CONSTRAINT "team_members_invited_by_fkey" 
FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;

ALTER TABLE "public"."profiles"
ADD CONSTRAINT "profiles_team_id_fkey" 
FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX "idx_team_members_team_id" ON "public"."team_members" ("team_id");
CREATE INDEX "idx_team_members_user_id" ON "public"."team_members" ("user_id");
CREATE INDEX "idx_profiles_team_id" ON "public"."profiles" ("team_id");
CREATE INDEX "idx_teams_created_by" ON "public"."teams" ("created_by");

-- Create function to automatically create a default team for new users
CREATE OR REPLACE FUNCTION create_default_team_for_user()
RETURNS TRIGGER AS $$
DECLARE
    new_team_id uuid;
    user_email text;
BEGIN
    -- Get user email from auth.users
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
    
    -- Create a default team for the user
    INSERT INTO public.teams (name, description, created_by)
    VALUES (
        COALESCE(NEW.full_name, user_email) || '''s Team',
        'Default team for ' || COALESCE(NEW.full_name, user_email),
        NEW.user_id
    )
    RETURNING id INTO new_team_id;
    
    -- Update the profile with the team_id
    UPDATE public.profiles 
    SET team_id = new_team_id 
    WHERE profile_id = NEW.profile_id;
    
    -- Add the user as admin of their default team
    INSERT INTO public.team_members (team_id, user_id, role, invited_by)
    VALUES (new_team_id, NEW.user_id, 'admin', NEW.user_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create default team
CREATE TRIGGER create_default_team_trigger
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_default_team_for_user();

-- Create function to update team updated_at timestamp
CREATE OR REPLACE FUNCTION update_team_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating team updated_at
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION update_team_updated_at();

-- Row Level Security Policies

-- Teams policies
ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view teams they are members of" ON "public"."teams"
    FOR SELECT TO authenticated
    USING (
        id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Team admins can update their teams" ON "public"."teams"
    FOR UPDATE TO authenticated
    USING (
        id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
        )
    );

CREATE POLICY "Authenticated users can create teams" ON "public"."teams"
    FOR INSERT TO authenticated
    WITH CHECK (created_by = auth.uid());

-- Team members policies
ALTER TABLE "public"."team_members" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view team members of their teams" ON "public"."team_members"
    FOR SELECT TO authenticated
    USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Team admins can manage team members" ON "public"."team_members"
    FOR ALL TO authenticated
    USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
        )
    );

CREATE POLICY "Users can view their own team membership" ON "public"."team_members"
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Update profiles RLS to include team context
DROP POLICY IF EXISTS "Enable users to view their own data only" ON "public"."profiles";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "public"."profiles";

CREATE POLICY "Users can view profiles in their teams" ON "public"."profiles"
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR 
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can update their own profile" ON "public"."profiles"
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Grant permissions
GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";

GRANT ALL ON TABLE "public"."team_members" TO "anon";
GRANT ALL ON TABLE "public"."team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members" TO "service_role";

GRANT USAGE ON TYPE "public"."team_member_role" TO "anon";
GRANT USAGE ON TYPE "public"."team_member_role" TO "authenticated";
GRANT USAGE ON TYPE "public"."team_member_role" TO "service_role";
