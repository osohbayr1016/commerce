export default function HeroBanner() {
  return (
    <section className="bg-white w-full py-12 md:py-16 lg:py-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6">
            ШИНЭ ЗАГВАР
          </h2>
          <button className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-base md:text-lg">
            <span>shop now</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
