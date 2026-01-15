interface ProductDescriptionProps {
  description?: string;
  nameMn: string;
}

export default function ProductDescription({ description, nameMn }: ProductDescriptionProps) {
  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
        Барааны дэлгэрэнгүй
      </h2>
      <div className="space-y-4 text-base text-gray-700 leading-relaxed">
        <p className="font-medium">{nameMn}</p>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
