"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export function ProfileButton() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // Загружаем данные
  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) setAuthUser(JSON.parse(saved));
  }, []);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  };

  // Если нет авторизации → кнопка "Войти"
  if (!authUser) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 text-[#4b2e16] cursor-pointer"
      >
        <User size={20} />
        <span>Войти</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      {/* ❤️ Кнопка с именем */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[#4b2e16]"
      >
        <User size={20} />
        <span>{authUser.name}</span>  {/* ← Показываем имя */}
      </button>

      {/* Выпадающее меню */}
      {open && (
        <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg p-3 w-44 border border-gray-200 z-50 animate-fade">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-lg"
          >
            <User size={18} />
            Профиль
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-100 rounded-lg text-left"
          >
            <LogOut size={18} />
            Выход
          </button>
        </div>
      )}
    </div>
  );
}
