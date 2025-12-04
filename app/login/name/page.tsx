"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NamePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const phone = localStorage.getItem("loginPhone");

    if (!phone) {
      alert("Ошибка: нет номера телефона");
      router.push("/login");
      return;
    }

    const user = {
      name,
      phone,
    };

    // сохраняем пользователя
    localStorage.setItem("authUser", JSON.stringify(user));

    alert("Добро пожаловать, " + name + "!");

    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[#fff9f5] flex justify-center items-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-[#eadfd7]">

        <h1 className="text-3xl font-bold text-[#4b2e16] text-center mb-6">
          Как вас зовут?
        </h1>

        <form onSubmit={handleSave} className="space-y-5">

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#e3d6cd] bg-[#fffaf7] 
            focus:outline-none focus:ring-2 focus:ring-[#860120]"
            placeholder="Введите ваше имя"
          />

          <button
            type="submit"
            className="w-full bg-[#860120] hover:bg-[#6b011a] text-white font-semibold py-3 rounded-xl transition"
          >
            Продолжить
          </button>

        </form>

      </div>
    </div>
  );
}
