-- Add Onboarding schema definition

CREATE TABLE IF NOT EXISTS  "public"."agency_onboarding_submissions" (
                                                      id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
                                                      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                                      legal_name text NOT NULL,
                                                      siret text NULL,
                                                      address_street text NULL,
                                                      address_postal_code text NULL,
                                                      address_city text NULL,
                                                      address_country text NULL,
                                                      specializations text[] NULL,
                                                      property_types text[] NULL,
                                                      key_sectors text NULL,
                                                      prospect_types text[] NULL,
                                                      buyer_info text[] NULL,
                                                      seller_info text[] NULL,
                                                      tenant_info text[] NULL,
                                                      appointment_types text[] NULL,
                                                      appointment_duration text NULL,
                                                      agent_emails text NULL,
                                                      billing_frequency text NULL,
                                                      plan text NULL,
                                                      accepted_cgu boolean NOT NULL DEFAULT FALSE,
                                                      understood_payment boolean NOT NULL DEFAULT FALSE,
                                                      CONSTRAINT agency_onboarding_submissions_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;