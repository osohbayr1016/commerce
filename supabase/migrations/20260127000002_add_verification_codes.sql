create table if not exists public.verification_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Index for faster lookups
create index if not exists verification_codes_email_idx on public.verification_codes(email);

-- Enable RLS
alter table public.verification_codes enable row level security;

-- Only service role should access this table directly (via API)
create policy "Service role can do everything on verification_codes"
  on public.verification_codes
  for all
  to service_role
  using (true)
  with check (true);

-- Allow public to insert? No, we'll use a function or service role in API.
-- The API route will use the service role client (createClient from @supabase/ssr usually doesn't give service role unless configured, but we can use simple supabase-js with service key if needed, or just allow public insert if we are careful).

-- Actually, for simplicity and security, let's keep it restricted. 
-- The Next.js API route will need to use a Supabase client with Service Role privileges to write to this table if we don't want to expose it.
-- OR we can allow public to insert/update their own email's code? But they are not authenticated yet.
-- So Service Role is best.

-- We'll assume the project has SUPABASE_SERVICE_ROLE_KEY env var available for the backend.
