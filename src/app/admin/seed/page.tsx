'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getErrorMessage } from '@/types';
import { mockProducts } from '@/data/mockProducts';

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<string[]>([]);
  const supabase = createClient();

  async function seedDatabase() {
    setLoading(true);
    setMessage('');
    setDetails([]);
    const logs: string[] = [];

    try {
      
      const { count: existingProductCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (existingProductCount && existingProductCount > 0) {
        logs.push(`⚠️ Өгөгдлийн санд ${existingProductCount} бүтээгдэхүүн байна`);
        setDetails([...logs]);
        
        if (!confirm(`Өгөгдлийн санд аль хэдийн ${existingProductCount} бүтээгдэхүүн байна.\n\nТа үргэлжлүүлбэл зөвхөн ШИНЭ бүтээгдэхүүн нэмэгдэх ба одоогийн өгөгдөл хэвээр үлдэнэ.\n\nҮргэлжлүүлэх үү?`)) {
          logs.push('❌ Хэрэглэгч цуцалсан');
          setDetails([...logs]);
          setMessage('Үйлдэл цуцлагдлаа');
          setLoading(false);
          return;
        }
      }

      
      logs.push('1. Ангилал шалгаж байна...');
      setDetails([...logs]);

      const { data: navCategories, error: catError } = await supabase
        .from('categories')
        .select('id, slug')
        .in('slug', ['male', 'female', 'accessory', 'perfume']);

      if (catError) throw new Error(`Ангилал унших алдаа: ${catError.message}`);
      const femaleCat = navCategories?.find((c: any) => c.slug === 'female');
      const accessoryCat = navCategories?.find((c: any) => c.slug === 'accessory');
      if (!femaleCat || !accessoryCat) {
        throw new Error('male, female, accessory, perfume ангилалууд байх ёстой. Migration ажиллуулна уу.');
      }
      logs.push(`✓ Nav ангилалууд олдлоо (female, accessory)`);
      setDetails([...logs]);

      
      logs.push('2. Одоогийн бүтээгдэхүүнүүдийг шалгаж байна...');
      setDetails([...logs]);

      const { data: existingProducts } = await supabase
        .from('products')
        .select('sku');
      
      const existingSkus = new Set(existingProducts?.map((p: any) => p.sku) || []);

      
      logs.push('3. Шинэ бүтээгдэхүүн нэмж байна...');
      setDetails([...logs]);

      const productsToInsert = mockProducts
        .filter((product) => !existingSkus.has(`#${product.id}`))
        .map((product) => ({
          name_en: product.nameEn,
          name_mn: product.nameMn,
          brand: product.brand,
          sku: `#${product.id}`,
          price: product.price,
          original_price: product.originalPrice,
          discount: product.discount || 0,
          stock: Math.floor(Math.random() * 50) + 10,
          sizes: [35, 36, 37, 38, 39, 40],
          description: `${product.nameMn} - ${product.brand}`,
          subcategory: product.category === 'boots' ? 'Гутал' : 'Цүнх',
          category_id: product.category === 'boots' ? femaleCat?.id : accessoryCat?.id,
          brand_color: product.brandColor,
          image_color: product.imageColor,
          has_financing: true,
          title: product.nameEn,
        }));

      if (productsToInsert.length === 0) {
        logs.push('ℹ️ Бүх бүтээгдэхүүн аль хэдийн нэмэгдсэн байна');
        setDetails([...logs]);
        setMessage('Бүх бүтээгдэхүүн аль хэдийн өгөгдлийн санд байна!');
        setLoading(false);
        return;
      }

      logs.push(`→ ${productsToInsert.length} шинэ бүтээгдэхүүн нэмэгдэх болно`);
      setDetails([...logs]);

      
      const batchSize = 10;
      let insertedCount = 0;

      for (let i = 0; i < productsToInsert.length; i += batchSize) {
        const batch = productsToInsert.slice(i, i + batchSize);
        const { error: prodError } = await supabase
          .from('products')
          .insert(batch);

        if (prodError) {
          logs.push(`! Batch ${Math.floor(i / batchSize) + 1} алдаа: ${prodError.message}`);
        } else {
          insertedCount += batch.length;
          logs.push(`- Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} бүтээгдэхүүн нэмэгдлээ`);
        }
        setDetails([...logs]);
      }

      logs.push(`✓ Нийт ${insertedCount} шинэ бүтээгдэхүүн нэмэгдлээ`);
      setDetails([...logs]);

      
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      logs.push(`4. ✓ Баталгаажуулалт: Өгөгдлийн санд одоо ${count} бүтээгдэхүүн байна`);
      setDetails([...logs]);

      setMessage(`Амжилттай! ${insertedCount} шинэ бүтээгдэхүүн нэмэгдлээ.`);
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      logs.push(`✗ Алдаа: ${errorMsg}`);
      setDetails([...logs]);
      setMessage(`Алдаа гарлаа: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Өгөгдөл нэмэх (Seed)
        </h1>
        <p className="text-base text-gray-600">
          Mock өгөгдлийг Supabase-д нэмэх
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Мэдээлэл
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✓ Энэ үйлдэл ЗӨВХӨН шинэ бүтээгдэхүүн нэмнэ</li>
            <li>✓ Одоогийн бүтээгдэхүүн хэвээр үлдэнэ</li>
            <li>✓ Mock өгөгдлөөс {mockProducts.length} бүтээгдэхүүн байна</li>
            <li>✓ Ангилал: male, female, accessory, perfume (migration) шаардлагатай</li>
            <li>✓ Давхар бүтээгдэхүүн нэмэгдэхгүй</li>
          </ul>

          <button
            onClick={seedDatabase}
            disabled={loading}
            className={`w-full px-6 py-3 rounded-lg text-base font-medium transition-colors ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
{loading ? 'Өгөгдөл нэмж байна...' : 'Шинэ өгөгдөл нэмэх'}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes('амжилттай')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        {details.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Үйлдлийн лог
            </h3>
            <div className="space-y-1 font-mono text-xs text-black">
              {details.map((detail, index) => (
                <div key={index}>{detail}</div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Зөвлөмж</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Анхны удаа: Энэ дарж mock өгөгдөл нэмнэ үү</li>
            <li>• Шинэ ангилал үүсгэх: Ангилал хуудас руу очино уу</li>
            <li>• Бүтээгдэхүүн нэмэх: Бүтээгдэхүүн хуудсанд "+ Бүтээгдэхүүн нэмэх" товч дарна</li>
            <li>• Энэ үйлдэл өгөгдөл устгахгүй - аюулгүй!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
