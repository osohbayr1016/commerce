// Script to fix old proxy image URLs to use public R2 URLs
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixImageUrls() {
  console.log('Fetching products with proxy URLs...');
  
  // Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name_en, images')
    .not('images', 'is', null);

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products`);

  let updatedCount = 0;

  for (const product of products) {
    if (!product.images || product.images.length === 0) continue;

    // Check if any image uses the proxy format
    const hasProxyUrl = product.images.some((url: string) => 
      url.startsWith('/api/images/r2/')
    );

    if (hasProxyUrl) {
      // Replace proxy URLs with public R2 URLs
      const updatedImages = product.images.map((url: string) => {
        if (url.startsWith('/api/images/r2/')) {
          return url.replace(
            '/api/images/r2/',
            'https://pub-917070bb7d724798b2b631d35c140746.r2.dev/commerce/'
          );
        }
        return url;
      });

      // Update the product
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: updatedImages })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Error updating product ${product.id}:`, updateError);
      } else {
        console.log(`✅ Updated product: ${product.name_en} (ID: ${product.id})`);
        console.log(`   Old: ${product.images[0]}`);
        console.log(`   New: ${updatedImages[0]}`);
        updatedCount++;
      }
    }
  }

  console.log(`\n✨ Fixed ${updatedCount} products`);
}

fixImageUrls().catch(console.error);
