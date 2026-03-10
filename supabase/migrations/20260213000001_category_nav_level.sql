-- Add level: 1 = nav (Man/Woman/Accessory), 2+ = dropdown only
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS level integer DEFAULT 1;

-- Add path for URL resolution: "man", "man/shoes", "man/shoes/boots"
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS path text;

CREATE INDEX IF NOT EXISTS idx_categories_level ON public.categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_path ON public.categories(path) WHERE path IS NOT NULL;

COMMENT ON COLUMN public.categories.level IS '1 = main nav (Man/Woman/Accessory), 2+ = dropdown only';
COMMENT ON COLUMN public.categories.path IS 'Full path from root for URL: man/shoes/boots';

-- Function to get category ID and all descendant IDs (for product filtering)
CREATE OR REPLACE FUNCTION public.get_category_descendant_ids(p_category_id integer)
RETURNS integer[] AS $$
  WITH RECURSIVE descendants AS (
    SELECT id FROM public.categories WHERE id = p_category_id
    UNION ALL
    SELECT c.id FROM public.categories c
    JOIN descendants d ON c.parent_id = d.id
  )
  SELECT array_agg(id) FROM descendants;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Trigger to auto-set path on insert/update
CREATE OR REPLACE FUNCTION public.set_category_path()
RETURNS trigger AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path := NEW.slug;
  ELSE
    SELECT COALESCE(p.path, p.slug) || '/' || NEW.slug
    INTO NEW.path
    FROM public.categories p
    WHERE p.id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS categories_set_path ON public.categories;
CREATE TRIGGER categories_set_path
  BEFORE INSERT OR UPDATE OF parent_id, slug ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_category_path();

-- Backfill path for existing categories
UPDATE public.categories c
SET path = sub.path
FROM (
  WITH RECURSIVE tree AS (
    SELECT id, slug, parent_id, slug::text AS path
    FROM public.categories WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.slug, c.parent_id, t.path || '/' || c.slug
    FROM public.categories c
    JOIN tree t ON c.parent_id = t.id
  )
  SELECT id, path FROM tree
) sub
WHERE c.id = sub.id AND (c.path IS NULL OR c.path != sub.path);
