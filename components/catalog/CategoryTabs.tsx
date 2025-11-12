'use client';

interface CategoryTabsProps {
  category: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({ category, onSelect }: CategoryTabsProps) {
  const categories = [
    { id: 'cakes', label: 'Торты' },
    { id: 'pies', label: 'Пироги' },
    { id: 'bakery', label: 'Выпечка' },
  ];

  return (
    <div className="flex justify-center gap-6 mt-6 mb-8">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`text-lg font-semibold pb-1 transition-colors ${
            category === c.id
              ? 'border-b-2 border-[#860120] text-[#860120]'
              : 'text-[#4b2e16] hover:text-[#860120]'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
