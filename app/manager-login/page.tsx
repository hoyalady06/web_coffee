"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManagerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/manager/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.ok) {
      setError("Неверный email или пароль");
      return;
    }

    router.push("/manager/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAF9]">
      <form
        onSubmit={submit}
        className="bg-white rounded-3xl shadow-sm border p-10 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-8 text-[#860120]">
          Вход для менеджера
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#860120] text-white rounded-xl py-3 font-semibold hover:bg-[#a4022a] transition"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
