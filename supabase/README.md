# Supabase Setup

## Running migrations

1. Go to your Supabase project → SQL Editor
2. Paste and run `migrations/001_initial_schema.sql`

This creates all tables, RLS policies, and the invoice counter function.

## Invoice counter function

The `increment_invoice_counter()` function must also be created via the SQL Editor (it's included in the migration file).
