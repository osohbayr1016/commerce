export interface Product {
  id: string;
  brand: string;
  nameEn: string;
  nameMn: string;
  nameRu?: string;
  nameZh?: string;
  nameIt?: string;
  category: 'boots' | 'bag';
  categoryPath?: string;
  price: number;
  originalPrice: number;
  discount?: number;
  brandColor: string;
  imageColor: string;
  images?: string[];
  stock?: number;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    brand: 'Hermès',
    nameEn: 'Birkin 30 Epsom Gold Leather Bag',
    nameMn: 'Hermès Birkin 30 алтан ширэн цүнх',
    category: 'bag',
    price: 38500000,
    originalPrice: 38500000,
    discount: 0,
    brandColor: '#B8860B',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 3
  },
  {
    id: '2',
    brand: 'Chanel',
    nameEn: 'Classic Double Flap Quilted Bag',
    nameMn: 'Chanel Сонгодог давхар нугалаастай ширмэл цүнх',
    category: 'bag',
    price: 32000000,
    originalPrice: 35000000,
    discount: 9,
    brandColor: '#000000',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a4a0?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 5
  },
  {
    id: '3',
    brand: 'Bottega Veneta',
    nameEn: 'Andiamo Intrecciato Shoulder Bag',
    nameMn: 'Bottega Veneta Andiamo сүлжмэл мөрний цүнх',
    category: 'bag',
    price: 15600000,
    originalPrice: 15600000,
    discount: 0,
    brandColor: '#2E8B57',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 8
  },
  {
    id: '4',
    brand: 'Saint Laurent',
    nameEn: 'Loulou Medium Quilted Suede Bag',
    nameMn: 'Saint Laurent Loulou хилэн ширмэл цүнх',
    category: 'bag',
    price: 9800000,
    originalPrice: 11500000,
    discount: 15,
    brandColor: '#1C1C1C',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 12
  },
  {
    id: '5',
    brand: 'Prada',
    nameEn: 'Galleria Saffiano Leather Tote',
    nameMn: 'Prada Galleria Saffiano ширэн цүнх',
    category: 'bag',
    price: 13400000,
    originalPrice: 13400000,
    discount: 0,
    brandColor: '#4B0082',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a4a0?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 6
  },
  {
    id: '6',
    brand: 'Saint Laurent',
    nameEn: 'Jane Leather Over-The-Knee Boots',
    nameMn: 'Saint Laurent Jane арьсан урт түрийтэй гутал',
    category: 'boots',
    price: 6800000,
    originalPrice: 8000000,
    discount: 15,
    brandColor: '#000000',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 10
  },
  {
    id: '7',
    brand: 'Loro Piana',
    nameEn: 'Regent Cashmere Trim Suede Boots',
    nameMn: 'Loro Piana Regent ноолууран доторлогоотой хилэн гутал',
    category: 'boots',
    price: 8500000,
    originalPrice: 8500000,
    discount: 0,
    brandColor: '#8B4513',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 7
  },
  {
    id: '8',
    brand: 'Hermès',
    nameEn: 'Jump Leather Riding Tall Boots',
    nameMn: 'Hermès Jump морин спортын ширэн урт гутал',
    category: 'boots',
    price: 9200000,
    originalPrice: 9200000,
    discount: 0,
    brandColor: '#D2691E',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 4
  },
  {
    id: '9',
    brand: 'Prada',
    nameEn: 'Monolith Patent Leather Platform Boots',
    nameMn: 'Prada Monolith патенталсан арьсан ултай гутал',
    category: 'boots',
    price: 5400000,
    originalPrice: 6000000,
    discount: 10,
    brandColor: '#1A1A1A',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 15
  },
  {
    id: '10',
    brand: 'Chanel',
    nameEn: 'Two-Tone Chain Detail Ankle Boots',
    nameMn: 'Chanel Хоёр өнгөт гинжин чимэглэлтэй богино гутал',
    category: 'boots',
    price: 7200000,
    originalPrice: 7200000,
    discount: 0,
    brandColor: '#2C2C2C',
    imageColor: '#FAFAFA',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 8
  }
];
