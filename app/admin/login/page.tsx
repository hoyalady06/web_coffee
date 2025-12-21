"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert("Неверный логин или пароль");
      return;
    }

    // ❗ НИКАКОГО localStorage
    router.push("/admin/dashboard");
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Вход в админ-панель</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block mb-3 border p-2 rounded"
      />

      <input
        placeholder="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block mb-4 border p-2 rounded"
      />

      <button
        onClick={handleLogin}
        className="bg-[#860120] text-white px-4 py-2 rounded"
      >
        Войти
      </button>
    </div>
  );
}
