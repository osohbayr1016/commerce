export default function PageNav() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4">
          <button className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 flex-1 text-center">
            E-Commerce
          </h1>
          <div className="w-10"></div>
        </div>
      </div>
    </div>
  );
}
