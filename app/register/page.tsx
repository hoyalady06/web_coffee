"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("REGISTER:", email, password);
    // Логика регистрации
  };

  return (
    <div className="min-h-screen bg-[#fff9f5] flex justify-center items-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-[#eadfd7]">

        <h1 className="text-3xl font-bold text-[#4b2e16] text-center mb-6">
          Регистрация
        </h1>

        <form onSubmit={handleRegister} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-1 text-[#4b2e16] font-medium">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e3d6cd] bg-[#fffaf7] focus:outline-none focus:ring-2 focus:ring-[#860120] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-[#4b2e16] font-medium">
              Пароль
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e3d6cd] bg-[#fffaf7] focus:outline-none focus:ring-2 focus:ring-[#860120] transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#860120] hover:bg-[#6b011a] text-white font-semibold py-3 rounded-xl transition"
          >
            Зарегистрироваться
          </button>
        </form>

        <p className="text-center text-[#4b2e16] mt-6">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="text-[#860120] font-semibold hover:underline"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
