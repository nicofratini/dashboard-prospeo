-- Fix RLS recursion issue by simplifying policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view team members of their teams" ON "public"."team_members";
DROP POLICY IF EXISTS "Team admins can manage team members" ON "public"."team_members";
DROP POLICY IF EXISTS "Users can view their own team membership" ON "public"."team_members";

DROP POLICY IF EXISTS "Users can view teams they are members of" ON "public"."teams";
DROP POLICY IF EXISTS "Team admins can update their teams" ON "public"."teams";

DROP POLICY IF EXISTS "Users can view profiles in their teams" ON "public"."profiles";

-- Create simplified, non-recursive policies for team_members
CREATE POLICY "Users can view their own team memberships" ON "public"."team_members"
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert team memberships for teams they admin" ON "public"."team_members"
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_members.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role = 'admin' 
            AND tm.is_active = true
        )
        OR 
        EXISTS (
            SELECT 1 FROM public.teams t
            WHERE t.id = team_members.team_id 
            AND t.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update team memberships for teams they admin" ON "public"."team_members"
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_members.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role = 'admin' 
            AND tm.is_active = true
        )
    );

CREATE POLICY "Users can delete team memberships for teams they admin or their own" ON "public"."team_members"
    FOR DELETE TO authenticated
    USING (
        user_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_members.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role = 'admin' 
            AND tm.is_active = true
        )
    );

-- Create simplified policies for teams
CREATE POLICY "Users can view teams they created or are members of" ON "public"."teams"
    FOR SELECT TO authenticated
    USING (
        created_by = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = teams.id 
            AND tm.user_id = auth.uid() 
            AND tm.is_active = true
        )
    );

CREATE POLICY "Team creators and admins can update teams" ON "public"."teams"
    FOR UPDATE TO authenticated
    USING (
        created_by = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = teams.id 
            AND tm.user_id = auth.uid() 
            AND tm.role = 'admin' 
            AND tm.is_active = true
        )
    );

-- Create simplified policy for profiles
CREATE POLICY "Users can view their own profile and team members profiles" ON "public"."profiles"
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.team_members tm1
            JOIN public.team_members tm2 ON tm1.team_id = tm2.team_id
            WHERE tm1.user_id = auth.uid() 
            AND tm2.user_id = profiles.user_id
            AND tm1.is_active = true 
            AND tm2.is_active = true
        )
    );

-- Create a view for team members with profile info to avoid recursion
CREATE OR REPLACE VIEW team_members_with_profiles AS
SELECT 
    tm.id,
    tm.team_id,
    tm.user_id,
    tm.role,
    tm.joined_at,
    tm.invited_by,
    tm.is_active,
    p.full_name,
    p.avatar_url,
    p.email,
    p.username
FROM team_members tm
LEFT JOIN profiles p ON tm.user_id = p.user_id;

-- Grant permissions on the view
GRANT SELECT ON team_members_with_profiles TO authenticated;
GRANT SELECT ON team_members_with_profiles TO anon;
GRANT SELECT ON team_members_with_profiles TO service_role;

-- Enable RLS on the view
ALTER VIEW team_members_with_profiles SET (security_invoker = true);
