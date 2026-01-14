import ProductForm from '../ProductForm';

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Шинэ бүтээгдэхүүн
        </h1>
        <p className="text-base text-gray-600">
          Шинэ бүтээгдэхүүн нэмэх
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
