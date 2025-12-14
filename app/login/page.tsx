"use client";

import { useState } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // Маска телефона
  const formatPhone = (v: string) => {
    v = v.replace(/\D/g, "").slice(0, 11);

    return (
      "+7 (" +
      (v.slice(1, 4) || "___") +
      ") " +
      (v.slice(4, 7) || "___") +
      "-" +
      (v.slice(7, 9) || "__") +
      "-" +
      (v.slice(9, 11) || "__")
    );
  };

  const handleSubmit = async () => {
    setError("");

    if (phone.replace(/\D/g, "").length !== 11)
{
      setError("Введите корректный номер телефона");
      return;
    }

    const cleaned = phone.replace(/\D/g, "");
    const fullPhone = "+7" + cleaned.slice(1);

    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError("Ошибка отправки кода");
        return;
      }

      alert("Ваш код: " + data.code); // имитация SMS

      localStorage.setItem("phoneTemp", fullPhone);
      window.location.href = "/login/code";
    } catch (err) {
      setError("Ошибка сети. Попробуйте позже.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f5] flex justify-center items-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-[#eadfd7]">
        <h1 className="text-3xl font-bold text-[#4b2e16] text-center mb-6">
          Вход по номеру<br /> телефона
        </h1>

        <label className="block mb-2 text-[#4b2e16] font-medium">Телефон</label>

        <input
          className="w-full px-4 py-3 rounded-xl border border-[#e3d6cd] bg-[#eef4ff]
          focus:outline-none focus:ring-2 focus:ring-[#860120] text-lg"
          value={formatPhone(phone)}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, ""));
            if (error) setError("");
          }}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-[#860120] hover:bg-[#6b011a] text-white
          font-semibold py-3 rounded-xl mt-6 transition"
        >
          Отправить код
        </button>
      </div>
    </div>
  );
}
