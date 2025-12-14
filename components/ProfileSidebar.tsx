"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";

const menu = [
  {
    title: "",
    items: [
      { href: "/profile", label: "Личная информация" },
      { href: "/profile/payments", label: "Способы оплаты" },
      { href: "/profile/bonus", label: "Баллы и бонусы" },
    ],
  },
  {
    title: "Заказы",
    items: [
      { href: "/profile/orders", label: "Мои заказы" },
      { href: "/profile/returns", label: "Мои возвраты" },
      { href: "/profile/bought", label: "Купленные товары" },
    ],
  },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // 🔥 Загрузка пользователя с backend
  useEffect(() => {
    const id = localStorage.getItem("user_id");

    if (!id) return;

    fetch(`/api/user?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // 🔥 Инициалы из имени
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      {/* Avatar + Name */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-[#860120] flex items-center justify-center text-3xl text-white font-bold">
          {initials}
        </div>

        <h3 className="mt-3 text-xl font-semibold text-[#860120]">
          {user?.name || "Пользователь"}
        </h3>
      </div>

      {/* Menu */}
      <div className="mt-8 space-y-8">
        {menu.map((group, i) => (
          <div key={i}>
            <p className="text-sm font-semibold text-[#860120]">
              {group.title}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {group.items.map((item) => {
                const active = pathname === item.href;

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

    </div>
  );
}
