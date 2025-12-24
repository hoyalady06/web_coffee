"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const menu = [
  {
    title: "",
    items: [
      { href: "/admin", label: "Dashboard" },
    ],
  },
  {
    title: "Управление",
    items: [
      { href: "/admin/orders", label: "Заказы" },
      { href: "/admin/returns", label: "Возвраты" },
      { href: "/admin/products", label: "Товары" },
      { href: "/admin/stats", label: "Статистика" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingReturns, setPendingReturns] = useState(0);

  useEffect(() => {
    supabase
      .from("returns")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .then(({ count }) => setPendingReturns(count || 0));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 w-[260px] shrink-0">
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
                    <span className="flex items-center justify-between">
                      <span>{item.label}</span>

                      {item.href === "/admin/returns" &&
                        pendingReturns > 0 && (
                          <span className="text-xs bg-[#860120]/10 text-[#860120] px-2 py-0.5 rounded-full">
                            {pendingReturns}
                          </span>
                        )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      {/* Logout */}
      <div className="mt-10 pt-6 border-t">
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin-login");
          }}
          className="text-sm text-gray-500 hover:text-red-600 transition"
        >
          Выйти
        </button>
      </div>
    </div>

  );
}
