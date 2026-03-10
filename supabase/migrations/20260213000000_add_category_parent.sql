-- Add parent_id to categories for hierarchical navigation (mega-menu subcategories)
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id integer REFERENCES public.categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

COMMENT ON COLUMN public.categories.parent_id IS 'Parent category for subcategory hierarchy. Null = top-level nav item.';
