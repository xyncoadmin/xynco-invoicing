-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clients
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  address text,
  currency text not null default 'CAD' check (currency in ('CAD', 'USD')),
  payment_terms integer not null default 14,
  created_at timestamptz not null default now()
);

-- Invoices
create table invoices (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references clients(id) on delete cascade,
  number text not null unique,
  status text not null default 'draft' check (status in ('draft','sent','paid','overdue','void')),
  issue_date date not null default current_date,
  due_date date not null,
  subtotal numeric(12,2) not null default 0,
  tax_rate numeric(5,4) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  stripe_invoice_id text,
  created_at timestamptz not null default now()
);

-- Invoice line items
create table invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  rate numeric(12,2) not null,
  subtotal numeric(12,2) not null
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references clients(id) on delete cascade,
  stripe_subscription_id text not null unique,
  amount numeric(12,2) not null,
  currency text not null default 'CAD',
  interval text not null check (interval in ('weekly','monthly','quarterly','annual')),
  status text not null default 'active' check (status in ('active','paused','cancelled')),
  next_billing_date date not null,
  created_at timestamptz not null default now()
);

-- Payments
create table payments (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  method text not null check (method in ('card','paypal','crypto','etransfer','direct_deposit','venmo')),
  amount numeric(12,2) not null,
  currency text not null default 'CAD',
  status text not null default 'pending' check (status in ('pending','confirmed','failed')),
  confirmed_at timestamptz,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

-- Invoice counter (for auto-incrementing INV-NNN)
create table invoice_counter (
  id integer primary key default 1 check (id = 1),
  last_number integer not null default 0
);
insert into invoice_counter (last_number) values (0);

-- Row-level security: only authenticated users can read/write
alter table clients enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table subscriptions enable row level security;
alter table payments enable row level security;
alter table invoice_counter enable row level security;

create policy "auth_all_clients" on clients for all using (auth.role() = 'authenticated');
create policy "auth_all_invoices" on invoices for all using (auth.role() = 'authenticated');
create policy "auth_all_items" on invoice_items for all using (auth.role() = 'authenticated');
create policy "auth_all_subs" on subscriptions for all using (auth.role() = 'authenticated');
create policy "auth_all_payments" on payments for all using (auth.role() = 'authenticated');
create policy "auth_all_counter" on invoice_counter for all using (auth.role() = 'authenticated');

-- Public read for payment page (clients can view invoice to pay it)
create policy "public_read_invoice" on invoices for select using (true);
create policy "public_read_items" on invoice_items for select using (true);
create policy "public_read_client" on clients for select using (true);

-- Invoice counter increment function
create or replace function increment_invoice_counter()
returns integer language plpgsql as $$
declare
  new_number integer;
begin
  update invoice_counter set last_number = last_number + 1 returning last_number into new_number;
  return new_number;
end;
$$;
