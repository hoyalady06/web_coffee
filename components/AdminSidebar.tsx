"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const menu = [
  {
    title: "",
    items: [
      { href: "/admin/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Управление",
    items: [
      { href: "/admin/orders", label: "Заказы" },
      { href: "/admin/products", label: "Товары" },
      { href: "/admin/stats", label: "Статистика" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 w-[220px] shrink-0">

      {/* Avatar + Name */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-[#860120] flex items-center justify-center text-3xl text-white font-bold">
          A
        </div>

        <h3 className="mt-3 text-xl font-semibold text-[#860120]">
          Admin
        </h3>
      </div>

      {/* Menu */}
      <div className="mt-8 space-y-8">
        {menu.map((group, i) => (
          <div key={i}>
            {group.title && (
              <p className="text-sm font-semibold text-[#860120]">
                {group.title}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "block rounded-xl px-4 py-2 text-[15px] transition",
                      active
                        ? "bg-[#FFFAF9] text-[#860120] font-semibold"
                        : "text-[#3a3a3a] hover:bg-[#f6f6f6]"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout (UI) */}
      <div className="mt-10 pt-6 border-t">
        <button className="text-sm text-gray-500 hover:text-red-600">
          Выйти
        </button>
      </div>

    </div>
  );
}
