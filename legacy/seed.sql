-- Insert Categories
INSERT INTO categories (name) VALUES 
('Lipstick'),
('Mascara'),
('Foundation'),
('Compact'),
('Skincare'),
('Accessories')
On CONFLICT (name) DO NOTHING;

-- Insert Products
INSERT INTO products (name, category, price, description, image_url) VALUES
('Matte Red Lipstick', 'Lipstick', 450, 'Long-lasting matte red lipstick.', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400'),
('Liquid Foundation', 'Foundation', 899, 'Full coverage liquid foundation.', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400'),
('Volumizing Mascara', 'Mascara', 350, 'Waterproof volumizing mascara.', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400'),
('Compact Powder', 'Compact', 299, 'Oil-control compact powder.', 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=400'),
('Hydrating Serum', 'Skincare', 1200, 'Vitamin C hydrating serum.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'),
('Makeup Brush Set', 'Accessories', 1500, 'Professional 12-piece brush set.', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400');
