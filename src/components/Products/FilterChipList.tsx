"use client";

interface FilterChipListProps<T extends string | number> {
  options: T[];
  selected: T[];
  onToggle: (option: T) => void;
  renderOption?: (option: T) => React.ReactNode;
  sizeVariant?: "default" | "square";
}

export default function FilterChipList<T extends string | number>({
  options,
  selected,
  onToggle,
  renderOption,
  sizeVariant = "default",
}: FilterChipListProps<T>) {
  const chipClass = (isSelected: boolean) =>
    sizeVariant === "square"
      ? `w-12 h-12 rounded border text-sm font-medium transition-colors ${
          isSelected
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
        }`
      : `px-3 py-1.5 rounded-full text-sm border transition-colors ${
          isSelected
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
        }`;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        const label = renderOption ? renderOption(option) : String(option);
        return (
          <button
            key={String(option)}
            type="button"
            onClick={() => onToggle(option)}
            className={chipClass(isSelected)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
