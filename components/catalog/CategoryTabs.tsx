'use client';

import { useState } from 'react';
import clsx from 'clsx';

const categories = [
  { id: 'cakes', name: 'Торты' },
  { id: 'pies', name: 'Пироги' },
  { id: 'bread', name: 'Нан' },
  { id: 'bakery', name: 'Выпечка' },
  { id: 'pastry', name: 'Пирожные' },
  { id: 'cookies', name: 'Печенье' },
  { id: 'icecream', name: 'Мороженое' },
  { id: 'combo', name: 'Комбо меню' },
  { id: 'cafe', name: 'Кафе' },
];

export function CategoryTabs({ onSelect }: { onSelect: (id: string) => void }) {
  const [active, setActive] = useState('cakes');

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect(id);
  };

  return (
    <div className="flex flex-wrap items-center gap-8 border-b border-[#f0e6dc] px-4 md:px-12 bg-[#fff9f5] py-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.id)}
          className={clsx(
            'pb-2 text-base font-medium transition-all',
            active === cat.id
              ? 'text-[#860120] border-b-2 border-[#860120]'
              : 'text-[#4b2e16] hover:text-[#4b2e16]'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
