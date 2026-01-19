-- Disable RLS on products to allow the seed script to insert/delete data
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS enabled but allow all, you could use:
-- CREATE POLICY "Enable all for anon" ON products FOR ALL USING (true) WITH CHECK (true);
