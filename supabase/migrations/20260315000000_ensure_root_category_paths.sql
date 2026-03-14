-- Ensure root categories have path = slug for /categories/{slug} URL resolution.
-- Nav seed uses slug: male, female, accessory, perfume; getCategoryByPath needs path or slug+parent_id.
UPDATE public.categories
SET path = slug
WHERE parent_id IS NULL
  AND (path IS NULL OR path != slug);
