"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function CategorySidebar() {
  const pathname = usePathname();
  const slug = pathname.startsWith("/category/")
    ? pathname.split("/")[2]
    : null;

  return (
    <div className="w-56 border-r pr-4 py-4 space-y-2">
      {categories.map((cat) => {
        const active = slug === cat.id;

        return (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className={clsx(
              "block w-full text-left px-4 py-2 rounded-md font-medium transition",
              active
                ? "bg-[#860120] text-white"
                : "text-[#4b2e16] hover:bg-[#f3e7e3]"
            )}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
