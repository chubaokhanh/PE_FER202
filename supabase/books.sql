-- ShelfLife Database Schema

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  author text not null,
  pages integer not null,
  status text not null default 'To Read',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint title_length check (length(trim(title)) > 0 and length(title) <= 80),
  constraint author_length check (length(trim(author)) > 0 and length(author) <= 60),
  constraint pages_range check (pages >= 1 and pages <= 5000),
  constraint status_valid check (status in ('To Read', 'Reading', 'Finished'))
);

-- Turn on Row Level Security
alter table books enable row level security;

-- Policies
create policy "Users can view their own books"
  on books for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own books"
  on books for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own books"
  on books for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own books"
  on books for delete
  to authenticated
  using (auth.uid() = user_id);

