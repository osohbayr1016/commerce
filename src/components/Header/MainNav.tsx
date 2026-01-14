import { createClient } from '@/lib/supabase/server';
import UserMenu from './UserMenu';

export default async function MainNav() {
  let siteName = 'shoez.mn';

  // Fetch site name from Supabase - handle build-time gracefully
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'site_name')
      .single();
    
    if (data?.value) {
      siteName = data.value;
    }
  } catch (error) {
    // During build time or if env vars missing, use default
    console.log('Using default site name (build time or env vars missing)');
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center gap-4 md:gap-6 text-base md:text-lg">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Эмэгтэй
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Эрэгтэй
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium hidden md:inline">
              USA захиалга
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium hidden md:inline">
              Хобби
            </a>
          </div>
          
          <div className="flex-1 flex justify-center">
            <a href="/" className="text-2xl md:text-3xl font-semibold text-gray-900">
              {siteName}
            </a>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Хайлт..."
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm md:text-base w-36 md:w-48 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <UserMenu />
          </div>
        </div>
        
        <nav className="flex items-center justify-center gap-5 md:gap-8 py-4 border-t border-gray-200 text-base md:text-lg">
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Цүнх
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Гутал
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Брэндүүд
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium hidden md:inline">
            Сэтгүүл
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium hidden lg:inline">
            Get the Look
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Хямдралтай %
          </a>
        </nav>
      </div>
    </div>
  );
}
