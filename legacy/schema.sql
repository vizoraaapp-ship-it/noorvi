-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT REFERENCES categories(name) ON DELETE SET NULL, -- Keeping this for backward compatibility if needed
    brand TEXT DEFAULT 'Noorvi', -- New: Brand Name
    main_category TEXT, -- New: e.g., LIPS, EYES
    sub_category TEXT, -- New: e.g., 1.1 Lipstick
    description TEXT,
    price NUMERIC NOT NULL, -- Final selling price
    mrp_price NUMERIC, -- New: MRP before discount
    discount_percent NUMERIC DEFAULT 0, -- New: Discount percentage
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create orders table (optional)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    product_details JSONB, -- Storing product info as JSON is flexible for this MVP
    total_amount NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Categories: Allow read access for everyone
CREATE POLICY "Allow public read access" ON categories
    FOR SELECT USING (true);

-- Products: Allow read access for everyone
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

-- Orders: Allow insert access for everyone (for guest checkout)
CREATE POLICY "Allow public insert" ON orders
    FOR INSERT WITH CHECK (true);
    
-- Note for Orders: If you want users to view their orders, you'll need to link them to auth.users
-- and add a SELECT policy based on user_id. For now, only INSERT is allowed publicly.
