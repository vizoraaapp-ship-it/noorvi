-- Run these commands in your Supabase SQL Editor to update the products table

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'Noorvi',
ADD COLUMN IF NOT EXISTS main_category TEXT,
ADD COLUMN IF NOT EXISTS sub_category TEXT,
ADD COLUMN IF NOT EXISTS mrp_price NUMERIC,
ADD COLUMN IF NOT EXISTS discount_percent NUMERIC DEFAULT 0;

-- Optional: Update existing rows specific logic if needed, but defaults handle it.
