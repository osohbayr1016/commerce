-- Seed nav categories: male, female, accessory, perfume
INSERT INTO public.categories (name, slug, name_en, name_mn, parent_id, level, display_order, is_active)
VALUES
  ('Male', 'male', 'Male', 'Эрэгтэй', NULL, 1, 1, true),
  ('Female', 'female', 'Female', 'Эмэгтэй', NULL, 1, 2, true),
  ('Accessory', 'accessory', 'Accessory', 'Дагалдах хэрэгсэл', NULL, 1, 3, true),
  ('Perfume', 'perfume', 'Perfume', 'Сайхан үнэртэй', NULL, 1, 4, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  name_mn = EXCLUDED.name_mn,
  parent_id = EXCLUDED.parent_id,
  level = EXCLUDED.level,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- Reassign products from boots -> female, bags -> accessory
UPDATE public.products p
SET category_id = (SELECT id FROM public.categories WHERE slug = 'female' LIMIT 1)
WHERE p.category_id = (SELECT id FROM public.categories WHERE slug = 'boots' LIMIT 1);

UPDATE public.products p
SET category_id = (SELECT id FROM public.categories WHERE slug = 'accessory' LIMIT 1)
WHERE p.category_id = (SELECT id FROM public.categories WHERE slug = 'bags' LIMIT 1);
