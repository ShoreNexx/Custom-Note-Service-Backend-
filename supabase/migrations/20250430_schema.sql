
create table notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  created_at timestamp default now()
);
