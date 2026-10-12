-- SNOWSOC Sustainable Growing + Community Survey
-- Two tables: anonymous answers, and optional contact details kept separate (PII).
-- The public (anon) role can INSERT only. Nobody can read through the public API;
-- view responses in the Supabase dashboard or with the service role.

create table public.survey_responses (
  id uuid primary key,
  created_at timestamptz not null default now(),
  survey_version text not null default 'snowsoc-2026-10',
  gardening_associations text,                 -- Q1 open-ended
  barriers text[] not null default '{}',       -- Q2 multi-select
  barriers_other text,
  confidence text,                             -- Q3
  interest_sustainable text,                   -- Q4
  interest_herbal text,                        -- Q6
  workshop_attendance text,                    -- Q5
  buy_vs_grow text,                            -- Q7
  plant_exchange text,                         -- Q8
  constraint survey_text_len check (
    coalesce(length(gardening_associations), 0) <= 2000
    and coalesce(length(barriers_other), 0) <= 500
  )
);

create table public.survey_contacts (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references public.survey_responses (id) on delete cascade,
  created_at timestamptz not null default now(),
  name text not null check (length(name) between 1 and 200),
  email text check (email is null or length(email) <= 320),
  phone text check (phone is null or length(phone) <= 40),
  email_opt_in boolean not null default false,
  sms_opt_in boolean not null default false,
  interests text[] not null default '{}',
  check (email is not null or phone is not null)
);

alter table public.survey_responses enable row level security;
alter table public.survey_contacts enable row level security;

create policy "Anyone can submit a survey response"
  on public.survey_responses for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can submit survey contact details"
  on public.survey_contacts for insert
  to anon, authenticated
  with check (true);

-- No select/update/delete policies: with RLS on, those are denied by default.
create index survey_contacts_response_id_idx on public.survey_contacts (response_id);
