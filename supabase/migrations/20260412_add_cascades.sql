-- Add ON DELETE CASCADE to dependent tables to securely handle product deletion

-- 1. order_items
ALTER TABLE "public"."order_items" 
  DROP CONSTRAINT IF EXISTS "order_items_product_id_fkey",
  ADD CONSTRAINT "order_items_product_id_fkey" 
  FOREIGN KEY ("product_id") 
  REFERENCES "public"."products"("id") 
  ON DELETE CASCADE;

-- 2. product_variants
ALTER TABLE "public"."product_variants" 
  DROP CONSTRAINT IF EXISTS "product_variants_product_id_fkey",
  ADD CONSTRAINT "product_variants_product_id_fkey" 
  FOREIGN KEY ("product_id") 
  REFERENCES "public"."products"("id") 
  ON DELETE CASCADE;

-- 3. wishlist
ALTER TABLE "public"."wishlist" 
  DROP CONSTRAINT IF EXISTS "wishlist_product_id_fkey",
  ADD CONSTRAINT "wishlist_product_id_fkey" 
  FOREIGN KEY ("product_id") 
  REFERENCES "public"."products"("id") 
  ON DELETE CASCADE;

-- 4. spin_history
ALTER TABLE "public"."spin_history" 
  DROP CONSTRAINT IF EXISTS "spin_history_product_id_fkey",
  ADD CONSTRAINT "spin_history_product_id_fkey" 
  FOREIGN KEY ("product_id") 
  REFERENCES "public"."products"("id") 
  ON DELETE CASCADE;

-- 5. spin_products
ALTER TABLE "public"."spin_products" 
  DROP CONSTRAINT IF EXISTS "spin_products_product_id_fkey",
  ADD CONSTRAINT "spin_products_product_id_fkey" 
  FOREIGN KEY ("product_id") 
  REFERENCES "public"."products"("id") 
  ON DELETE CASCADE;

-- 6. cart_items (if database mapped)
ALTER TABLE "public"."cart_items" 
  DROP CONSTRAINT IF EXISTS "cart_items_product_id_fkey",
  ADD CONSTRAINT "cart_items_product_id_fkey" 
  FOREIGN KEY ("product_id") 
  REFERENCES "public"."products"("id") 
  ON DELETE CASCADE;

-- 7. product_views
ALTER TABLE "public"."product_views" 
  DROP CONSTRAINT IF EXISTS "product_views_product_id_fkey",
  ADD CONSTRAINT "product_views_product_id_fkey" 
  FOREIGN KEY ("product_id") 
  REFERENCES "public"."products"("id") 
  ON DELETE CASCADE;

-- 8. product_reviews
ALTER TABLE "public"."product_reviews" 
  DROP CONSTRAINT IF EXISTS "product_reviews_product_id_fkey",
  ADD CONSTRAINT "product_reviews_product_id_fkey" 
  FOREIGN KEY ("product_id") 
  REFERENCES "public"."products"("id") 
  ON DELETE CASCADE;
