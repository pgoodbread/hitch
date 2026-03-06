create table support_emails (
  id uuid primary key default gen_random_uuid(),
  email_id text not null unique,
  from_address text not null,
  to_addresses text[] not null,
  subject text,
  body_text text,
  body_html text,
  created_at timestamptz not null default now()
);
