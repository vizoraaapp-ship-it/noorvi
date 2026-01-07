-- 1. Insert Categories first to satisfy Foreign Key Constraint
INSERT INTO categories (name) VALUES 
('LIPS'),
('EYES'),
('FACE'),
('NAILS'),
('TOOLS')
ON CONFLICT (name) DO NOTHING;

-- Optional: Clean up old Mars entries
DELETE FROM products WHERE brand = 'MARS';

-- Insert MARS Products
INSERT INTO products (name, brand, main_category, sub_category, mrp_price, discount_percent, price, description, image_url, category) VALUES
-- 1. LIPS
('Lipstick Pencil', 'MARS', 'LIPS', '1.1 Lipstick', 599, 20, 479, 'MARS Lipstick Pencil - 1.1 Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Plush Velvet Lipstick', 'MARS', 'LIPS', '1.1 Lipstick', 279, 20, 223, 'MARS Plush Velvet Lipstick - 1.1 Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Creamy Matte Lipstick', 'MARS', 'LIPS', '1.1 Lipstick', 199, 20, 159, 'MARS Creamy Matte Lipstick - 1.1 Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('3 Matte Lipstick Box', 'MARS', 'LIPS', '1.1 Lipstick', 447, 20, 358, 'MARS 3 Matte Lipstick Box - 1.1 Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Cloud Kiss Lipstick', 'MARS', 'LIPS', '1.1 Lipstick', 299, 20, 239, 'MARS Cloud Kiss Lipstick - 1.1 Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Non-Transfer Butter Stick', 'MARS', 'LIPS', '1.1 Lipstick', 349, 20, 279, 'MARS Non-Transfer Butter Stick - 1.1 Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Silk Matte Lipstick', 'MARS', 'LIPS', '1.1 Lipstick', 249, 20, 199, 'MARS Silk Matte Lipstick - 1.1 Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Super Stay Lipstick', 'MARS', 'LIPS', '1.1 Lipstick', 299, 20, 239, 'MARS Super Stay Lipstick - 1.1 Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),

-- 1.2 Lip Crayon
('Matte Lip Crayon', 'MARS', 'LIPS', '1.2 Lip Crayon', 299, 20, 239, 'MARS Matte Lip Crayon - 1.2 Lip Crayon', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Poppins Lip Crayon', 'MARS', 'LIPS', '1.2 Lip Crayon', 249, 20, 199, 'MARS Poppins Lip Crayon - 1.2 Lip Crayon', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),

-- 1.3 Liquid Lipstick
('Colorbum Liquid Lipstick', 'MARS', 'LIPS', '1.3 Liquid Lipstick', 349, 20, 279, 'MARS Colorbum Liquid Lipstick - 1.3 Liquid Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Matte Lip Color', 'MARS', 'LIPS', '1.3 Liquid Lipstick', 299, 20, 239, 'MARS Matte Lip Color - 1.3 Liquid Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Popstar Liquid Mousse Lipstick', 'MARS', 'LIPS', '1.3 Liquid Lipstick', 349, 20, 279, 'MARS Popstar Liquid Mousse Lipstick - 1.3 Liquid Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Matte Muse Lipstick', 'MARS', 'LIPS', '1.3 Liquid Lipstick', 299, 20, 239, 'MARS Matte Muse Lipstick - 1.3 Liquid Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Queens of Mattes Liquid Lipstick Box', 'MARS', 'LIPS', '1.3 Liquid Lipstick', 599, 20, 479, 'MARS Queens of Mattes Liquid Lipstick Box - 1.3 Liquid Lipstick', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),

-- 1.4 Lip Liner
('Edge of Desire Lip Liner', 'MARS', 'LIPS', '1.4 Lip Liner', 149, 20, 119, 'MARS Edge of Desire Lip Liner - 1.4 Lip Liner', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Edge of Desire Lip Liner with Holder', 'MARS', 'LIPS', '1.4 Lip Liner', 199, 20, 159, 'MARS Edge of Desire Lip Liner with Holder - 1.4 Lip Liner', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),

-- 1.5 Lip Tint / Mist
('Drip Lip Mist', 'MARS', 'LIPS', '1.5 Lip Tint / Mist', 299, 20, 239, 'MARS Drip Lip Mist - 1.5 Lip Tint / Mist', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Love Track Velvet Lip Tint', 'MARS', 'LIPS', '1.5 Lip Tint / Mist', 349, 20, 279, 'MARS Love Track Velvet Lip Tint - 1.5 Lip Tint / Mist', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),

-- 1.6 Lip Palette
('Infinity Lip Palette', 'MARS', 'LIPS', '1.6 Lip Palette', 499, 20, 399, 'MARS Infinity Lip Palette - 1.6 Lip Palette', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),

-- 1.7 Lip Balm
('Lip Lollies Lip Balm', 'MARS', 'LIPS', '1.7 Lip Balm', 199, 20, 159, 'MARS Lip Lollies Lip Balm - 1.7 Lip Balm', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Hydratint Balm', 'MARS', 'LIPS', '1.7 Lip Balm', 249, 20, 199, 'MARS Hydratint Balm - 1.7 Lip Balm', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Full of Water Lip Balm', 'MARS', 'LIPS', '1.7 Lip Balm', 199, 20, 159, 'MARS Full of Water Lip Balm - 1.7 Lip Balm', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Aqua Splash Lip Balm', 'MARS', 'LIPS', '1.7 Lip Balm', 199, 20, 159, 'MARS Aqua Splash Lip Balm - 1.7 Lip Balm', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Click-Stick Gloss Lip Balm', 'MARS', 'LIPS', '1.7 Lip Balm', 249, 20, 199, 'MARS Click-Stick Gloss Lip Balm - 1.7 Lip Balm', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),

-- 1.8 Lip Gloss / Oil
('Lippy Top Lip Gel', 'MARS', 'LIPS', '1.8 Lip Gloss / Oil', 199, 20, 159, 'MARS Lippy Top Lip Gel - 1.8 Lip Gloss / Oil', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Clear Quartz Lip Gloss', 'MARS', 'LIPS', '1.8 Lip Gloss / Oil', 249, 20, 199, 'MARS Clear Quartz Lip Gloss - 1.8 Lip Gloss / Oil', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Candylicious Lip Gloss', 'MARS', 'LIPS', '1.8 Lip Gloss / Oil', 249, 20, 199, 'MARS Candylicious Lip Gloss - 1.8 Lip Gloss / Oil', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),
('Color Changing Lip Oil', 'MARS', 'LIPS', '1.8 Lip Gloss / Oil', 299, 20, 239, 'MARS Color Changing Lip Oil - 1.8 Lip Gloss / Oil', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 'LIPS'),

-- 2. EYES
('Micro Precision Brow Pencil', 'MARS', 'EYES', '2.1 Eyebrow', 199, 20, 159, 'MARS Micro Precision Brow Pencil - 2.1 Eyebrow', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Oh Brow Eyebrow Pencil', 'MARS', 'EYES', '2.1 Eyebrow', 149, 20, 119, 'MARS Oh Brow Eyebrow Pencil - 2.1 Eyebrow', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Brow Better Eyebrow Pencil', 'MARS', 'EYES', '2.1 Eyebrow', 199, 20, 159, 'MARS Brow Better Eyebrow Pencil - 2.1 Eyebrow', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Eyebrow Pencil', 'MARS', 'EYES', '2.1 Eyebrow', 99, 20, 79, 'MARS Eyebrow Pencil - 2.1 Eyebrow', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Eyebrow Powder Palette', 'MARS', 'EYES', '2.1 Eyebrow', 299, 20, 239, 'MARS Eyebrow Powder Palette - 2.1 Eyebrow', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),

('Liquid Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 199, 20, 159, 'MARS Liquid Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Pen Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 249, 20, 199, 'MARS Pen Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Free Flow Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 199, 20, 159, 'MARS Free Flow Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Hyper Smooth Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 299, 20, 239, 'MARS Hyper Smooth Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Ink Black Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 199, 20, 159, 'MARS Ink Black Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('So Black Liquid Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 199, 20, 159, 'MARS So Black Liquid Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Sky Liner Matte Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 249, 20, 199, 'MARS Sky Liner Matte Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('City Strokes Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 299, 20, 239, 'MARS City Strokes Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Social Black Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 199, 20, 159, 'MARS Social Black Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Twinkle Wink Glitter Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 299, 20, 239, 'MARS Twinkle Wink Glitter Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Northern Lights Pencil Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 249, 20, 199, 'MARS Northern Lights Pencil Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Northern Lights Liquid Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 299, 20, 239, 'MARS Northern Lights Liquid Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Hue Gel Eyeliner', 'MARS', 'EYES', '2.2 Eyeliner', 299, 20, 239, 'MARS Hue Gel Eyeliner - 2.2 Eyeliner', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),

('Kohl of Fame Kajal', 'MARS', 'EYES', '2.3 Kajal', 199, 20, 159, 'MARS Kohl of Fame Kajal - 2.3 Kajal', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('WSWB Kajal', 'MARS', 'EYES', '2.3 Kajal', 149, 20, 119, 'MARS WSWB Kajal - 2.3 Kajal', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Ziddi Kajal', 'MARS', 'EYES', '2.3 Kajal', 199, 20, 159, 'MARS Ziddi Kajal - 2.3 Kajal', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Smooth Glide Kajal', 'MARS', 'EYES', '2.3 Kajal', 199, 20, 159, 'MARS Smooth Glide Kajal - 2.3 Kajal', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),

('Fabulash Mascara', 'MARS', 'EYES', '2.4 Mascara', 299, 20, 239, 'MARS Fabulash Mascara - 2.4 Mascara', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Forget Falsies Mascara', 'MARS', 'EYES', '2.4 Mascara', 349, 20, 279, 'MARS Forget Falsies Mascara - 2.4 Mascara', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Silk Lengthening Mascara', 'MARS', 'EYES', '2.4 Mascara', 299, 20, 239, 'MARS Silk Lengthening Mascara - 2.4 Mascara', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),
('Double Trouble Mascara', 'MARS', 'EYES', '2.4 Mascara', 399, 20, 319, 'MARS Double Trouble Mascara - 2.4 Mascara', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=400', 'EYES'),

-- 3. FACE
('Pore Cure Primer', 'MARS', 'FACE', '3.1 Primer', 399, 20, 319, 'MARS Pore Cure Primer - 3.1 Primer', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Take A Glow Primer', 'MARS', 'FACE', '3.1 Primer', 349, 20, 279, 'MARS Take A Glow Primer - 3.1 Primer', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Hydra Glow Primer', 'MARS', 'FACE', '3.1 Primer', 399, 20, 319, 'MARS Hydra Glow Primer - 3.1 Primer', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Face Primer', 'MARS', 'FACE', '3.1 Primer', 299, 20, 239, 'MARS Face Primer - 3.1 Primer', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Zero Pore Perfection Primer', 'MARS', 'FACE', '3.1 Primer', 399, 20, 319, 'MARS Zero Pore Perfection Primer - 3.1 Primer', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Primer + Makeup Fixer', 'MARS', 'FACE', '3.1 Primer', 499, 20, 399, 'MARS Primer + Makeup Fixer - 3.1 Primer', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),

('Bloom BB Cream', 'MARS', 'FACE', '3.2 Foundation / BB', 299, 20, 239, 'MARS Bloom BB Cream - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('BB Cream Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 349, 20, 279, 'MARS BB Cream Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Miracle BB Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 399, 20, 319, 'MARS Miracle BB Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Matte Mousse Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 449, 20, 359, 'MARS Matte Mousse Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('2 in 1 Super Stay Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 499, 20, 399, 'MARS 2 in 1 Super Stay Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Gold Waves Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 549, 20, 439, 'MARS Gold Waves Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Matte Maniac Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 499, 20, 399, 'MARS Matte Maniac Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('High Coverage Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 549, 20, 439, 'MARS High Coverage Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Mist Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 399, 20, 319, 'MARS Mist Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Zero Blend Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 499, 20, 399, 'MARS Zero Blend Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),
('Color Changing Foundation', 'MARS', 'FACE', '3.2 Foundation / BB', 399, 20, 319, 'MARS Color Changing Foundation - 3.2 Foundation / BB', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400', 'FACE'),

-- 4. NAILS
('Color Bomb Nail Paint', 'MARS', 'NAILS', '4. NAILS', 99, 20, 79, 'MARS Color Bomb Nail Paint - 4. NAILS', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400', 'NAILS'),
('Euro Nail Paint', 'MARS', 'NAILS', '4. NAILS', 99, 20, 79, 'MARS Euro Nail Paint - 4. NAILS', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400', 'NAILS'),
('Cosmic Hues Nail Paint', 'MARS', 'NAILS', '4. NAILS', 149, 20, 119, 'MARS Cosmic Hues Nail Paint - 4. NAILS', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400', 'NAILS'),
('Nail Polish Remover', 'MARS', 'NAILS', '4. NAILS', 99, 20, 79, 'MARS Nail Polish Remover - 4. NAILS', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400', 'NAILS'),

-- 5. TOOLS
('Brush Sets', 'MARS', 'TOOLS', '5. TOOLS', 799, 20, 639, 'MARS Brush Sets - 5. TOOLS', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400', 'TOOLS'),
('Individual Brushes', 'MARS', 'TOOLS', '5. TOOLS', 149, 20, 119, 'MARS Individual Brushes - 5. TOOLS', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400', 'TOOLS'),
('Beauty Blender / Puff / Mirror', 'MARS', 'TOOLS', '5. TOOLS', 99, 20, 79, 'MARS Beauty Blender / Puff / Mirror - 5. TOOLS', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400', 'TOOLS');
