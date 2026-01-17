export default function HeroBanner() {
  return (
    <section className="bg-white w-full py-10 md:py-14 lg:py-16 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Your Company</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900">
              E-Commerce
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Онлайн худалдааг хөгжүүлэгч платформ
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm md:text-base">
            <span>Дэлгүүр хэсэх</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
