-- Create a table for Meta Ads Leads
create table leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  
  -- Step 1: Business Basics
  business_name text,
  website_url text not null,
  industry text,
  target_location text,
  contact_name text,
  contact_email text,
  
  -- Step 2: Goals
  primary_goal text,
  success_description text,
  
  -- Step 3: Budget & Timeline
  monthly_budget numeric,
  timeline text,
  duration text,
  
  -- Step 4: Context
  additional_challenges text,
  extra_context text,
  
  -- Output
  strategy_markdown text, -- The output from Manus AI
  
  -- Metadata
  ghl_synced boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table leads enable row level security;

-- Create policy: Users can only see their own strategies
create policy "Users can view their own strategies"
  on leads for select
  using (auth.uid() = user_id);

create policy "Users can insert their own strategies"
  on leads for insert
  with check (auth.uid() = user_id);
