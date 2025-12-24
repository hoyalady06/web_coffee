"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.ok) {
      router.push("/admin");
    } else {
      alert("Неверный логин или пароль");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAF9]">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-[400px]">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Вход в админ-панель
        </h1>

        <input
          className="w-full border rounded-xl px-4 py-3 mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded-xl px-4 py-3 mb-6"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-[#860120] text-white py-3 rounded-xl"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
