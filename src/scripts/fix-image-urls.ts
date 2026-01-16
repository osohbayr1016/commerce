
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixImageUrls() {
  
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name_en, images')
    .not('images', 'is', null);

  if (error) {
    return;
  }


  let updatedCount = 0;

  for (const product of products) {
    if (!product.images || product.images.length === 0) continue;

    
    const hasProxyUrl = product.images.some((url: string) => 
      url.startsWith('/api/images/r2/')
    );

    if (hasProxyUrl) {
      
      const updatedImages = product.images.map((url: string) => {
        if (url.startsWith('/api/images/r2/')) {
          return url.replace(
            '/api/images/r2/',
            `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev/${process.env.R2_BUCKET_NAME}/`,
          );
        }
        return url;
      });

      
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: updatedImages })
        .eq('id', product.id);

      if (updateError) {
      } else {
        updatedCount++;
      }
    }
  }

}

