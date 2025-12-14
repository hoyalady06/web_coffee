"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CodePage() {
  const [codeInput, setCodeInput] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("phoneTemp");
    if (!saved) router.push("/login");
    else setPhone(saved);
  }, []);

  const handleInput = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const arr = [...codeInput];
    arr[index] = value;
    setCodeInput(arr);

    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }

    if (arr.join("").length === 4) verify(arr.join(""));
  };

  // -------------------------------
  // 🔥 ПРОВЕРКА КОДА
  // -------------------------------
  const verify = async (entered: string) => {
    setError("");

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: entered }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError("Неверный код");
        return;
      }

      // -------------------------------
      // 🔥 Сохраняем user.id из ответа
      // -------------------------------
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("role", data.user.role || "user");

      localStorage.removeItem("phoneTemp");

      router.push("/profile");
    } catch {
      setError("Ошибка сети");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-6">
      <div className="= p-8 rounded-3xl shadow-lg border border-[#eadfd7]">

        <h1 className="text-3xl font-bold text-[#4b2e16] text-center mb-4">
          Авторизация
        </h1>

        <p className="text-center text-[#4b2e16] mb-6">
          Введите код, отправленный на<br />
          <b className="text-lg">{phone}</b>
        </p>

        <div className="flex justify-center gap-4 mb-4">
          {codeInput.map((v, i) => (
            <input
              key={i}
              id={`code-${i}`}
              maxLength={1}
              value={v}
              className="w-14 h-14 text-center border rounded-xl text-2xl bg-[#eef4ff]"
              onChange={(e) => handleInput(e.target.value, i)}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}
