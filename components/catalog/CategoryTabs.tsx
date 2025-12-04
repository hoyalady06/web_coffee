"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

const categories = [
  { id: "cakes", name: "Торты" },
  { id: "pies", name: "Пироги" },
  { id: "bread", name: "Хлеб" },
  { id: "bakery", name: "Выпечка" },
  { id: "desserts", name: "Пирожные" },
  { id: "cookies", name: "Печенье" },
  { id: "icecream", name: "Мороженое" },
  { id: "combo", name: "Комбо меню" },
  { id: "cafe", name: "Кафе" },
];

export function CategoryTabs({
  active,
  onSelect,
}: {
  active?: string;
  onSelect?: (id: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // если мы на странице /category/[slug]
  const isCategoryPage = pathname.startsWith("/category/");
  const slug = pathname.split("/")[2];

  const current = isCategoryPage ? slug : active;

  const handleClick = (id: string) => {
    if (onSelect) {
      onSelect(id); // режим главной страницы
    }
    router.push(`/category/${id}`); // переход на страницу категории
  };

  return (
    <div className="flex gap-8 border-b px-4 py-4  overflow-x-auto">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          className={clsx(
            "pb-2 text-base font-medium transition-all",
            current === cat.id
              ? "text-[#860120] border-b-2 border-[#860120]"
              : "text-[#4b2e16]"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
