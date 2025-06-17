alter table "public"."profiles" drop column "profile_picture_url";

alter table "public"."profiles" add column "avatar_url" text;

alter table "public"."profiles" add column "username" text;

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";


