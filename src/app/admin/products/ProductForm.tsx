'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Product, Category, getErrorMessage } from '@/types';
import ImageUploader from '@/components/admin/ImageUploader';

export default function ProductForm({ product }: { product?: Product }) {
  const [formData, setFormData] = useState({
    name_en: product?.name_en || '',
    name_mn: product?.name_mn || '',
    brand: product?.brand || '',
    sku: product?.sku || '',
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    discount: product?.discount || 0,
    stock: product?.stock || 0,
    sizes: product?.sizes?.join(',') || '',
    description: product?.description || '',
    subcategory: product?.subcategory || '',
    category_id: product?.category_id || '',
    brand_color: product?.brand_color || '#F5F5F5',
    image_color: product?.image_color || '#FAFAFA',
    has_financing: product?.has_financing || false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (data) setCategories(data);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const sizesArray = formData.sizes
        ? formData.sizes.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
        : [];

      const productData = {
        title: formData.name_en || formData.name_mn || 'Untitled Product', 
        name_en: formData.name_en,
        name_mn: formData.name_mn,
        brand: formData.brand,
        sku: formData.sku,
        price: parseInt(formData.price.toString()),
        original_price: parseInt(formData.original_price.toString()),
        discount: parseInt(formData.discount.toString()),
        stock: parseInt(formData.stock.toString()),
        sizes: sizesArray,
        description: formData.description,
        subcategory: formData.subcategory,
        category_id: formData.category_id ? parseInt(formData.category_id.toString()) : null,
        brand_color: formData.brand_color,
        image_color: formData.image_color,
        has_financing: formData.has_financing,
        images: images,
      };

      if (product?.id) {
        
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;
        setMessage('Бүтээгдэхүүн амжилттай шинэчлэгдлээ!');
      } else {
        
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        setMessage('Бүтээгдэхүүн амжилттай нэмэгдлээ!');
      }

      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1500);
    } catch (error) {
      setMessage(`Алдаа гарлаа: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-black mb-4">Зураг</h2>
        <ImageUploader images={images} onImagesChange={setImages} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-black mb-4">Үндсэн мэдээлэл</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Нэр (Англи) *
            </label>
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Нэр (Монгол) *
            </label>
            <input
              type="text"
              name="name_mn"
              value={formData.name_mn}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Брэнд *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold text-black mb-2">
            Тайлбар
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-black mb-4">Үнийн мэдээлэл</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Үнэ *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Анхны үнэ *
            </label>
            <input
              type="number"
              name="original_price"
              value={formData.original_price}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Хөнгөлөлт (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-black mb-4">Ангилал & Нөөц</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Ангилал
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Сонгоно уу</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Дэд ангилал
            </label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Жишээ: Гутал"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Нөөц *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Размерууд (таслалаар тусгаарлах)
            </label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="35, 36, 37, 38, 39, 40"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="has_financing"
            checked={formData.has_financing}
            onChange={handleChange}
            className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
          />
          <label className="ml-3 text-base font-medium text-black">
            Зээлийн боломжтой
          </label>
        </div>
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

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-base font-medium transition-colors ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {loading ? 'Хадгалж байна...' : product?.id ? 'Шинэчлэх' : 'Нэмэх'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Цуцлах
        </button>
      </div>
    </form>
  );
}
