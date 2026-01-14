import MainNav from '@/components/Header/MainNav';
import Breadcrumb from '@/components/ProductDetail/Breadcrumb';
import ProductImageGallery from '@/components/ProductDetail/ProductImageGallery';
import ProductInfo from '@/components/ProductDetail/ProductInfo';
import ProductDescription from '@/components/ProductDetail/ProductDescription';
import Footer from '@/components/Footer/Footer';
import { createClient } from '@/lib/supabase/server';
import { ProductDetail } from '@/data/mockProductDetail';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Extract potential product ID from slug (last part after final dash)
  const parts = slug.split('-');
  const potentialId = parts[parts.length - 1];
  
  // Try to fetch product by ID or SKU
  const { data: dbProduct } = await supabase
    .from('products')
    .select('*')
    .or(`id.eq.${potentialId},sku.eq.#${potentialId}`)
    .single();

  if (!dbProduct) {
    notFound();
  }

  // Convert database product to ProductDetail interface
  const product: ProductDetail = {
    id: dbProduct.id,
    slug: slug,
    brand: dbProduct.brand || '',
    nameEn: dbProduct.name_en || dbProduct.title || '',
    nameMn: dbProduct.name_mn || '',
    sku: dbProduct.sku || '',
    category: 'Эмэгтэй',
    subcategory: dbProduct.subcategory || 'Гутал',
    price: dbProduct.price || 0,
    originalPrice: dbProduct.original_price || dbProduct.price || 0,
    discount: dbProduct.discount || 0,
    savings: (dbProduct.original_price || 0) - (dbProduct.price || 0),
    sizes: dbProduct.sizes || [35, 36, 37, 38, 39, 40],
    description: dbProduct.description,
    images: ['image1', 'image2', 'image3', 'image4', 'image5'],
    brandColor: dbProduct.brand_color || '#F5F5F5',
    imageColor: dbProduct.image_color || '#FAFAFA',
    hasFinancing: dbProduct.has_financing || false,
  };

  const breadcrumbItems = [
    { label: 'Нүүр', href: '/' },
    { label: product.category, href: `/${product.category.toLowerCase()}` },
    { label: product.subcategory, href: `/${product.category.toLowerCase()}/${product.subcategory.toLowerCase()}` },
    { label: product.nameEn },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNav />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div>
              <ProductImageGallery
                images={product.images}
                imageColor={product.imageColor}
                productName={product.nameEn}
              />
            </div>
            
            <div>
              <ProductInfo product={product} />
            </div>
          </div>
          
          <div className="max-w-4xl">
            <ProductDescription
              description={product.description}
              nameMn={product.nameMn}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
