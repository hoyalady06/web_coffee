"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProfileButton() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const uid = localStorage.getItem("user_id");
      setLoggedIn(!!uid);
    };

    checkAuth();
    window.addEventListener("authChange", checkAuth);

    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  };

  const handleClick = () => {
    if (!loggedIn) {
      router.push("/login");   // 🔥 МІНЕ ОСЫ ЖЕР — ШЕШІМ
      return;
    }

    setOpen(!open);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleClick}
        className="flex items-center gap-1 text-[#4b2e16] hover:text-[#860120]"
      >
        <User size={22} />
        {!loggedIn && <span className="font-semibold">Войти</span>}
      </button>

      {open && loggedIn && (
        <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-xl border py-2 z-50">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
          >
            <User size={18} />
            Профиль
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
          >
            <LogOut size={18} />
            Выход
          </button>
        </div>
      )}
    </div>
  );
}
