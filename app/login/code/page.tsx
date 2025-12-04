"use client";

import { useEffect, useState } from "react";

export default function CodePage() {
  const [codeInput, setCodeInput] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("phoneTemp");
    if (!saved) window.location.href = "/login";
    else setPhone(saved);
  }, []);

  const handleInput = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newArr = [...codeInput];
    newArr[index] = value;
    setCodeInput(newArr);

    // авто переход
    if (value && index < 3) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }

    if (newArr.join("").length === 4) validate(newArr.join(""));
  };

  const validate = (entered: string) => {
    const real = localStorage.getItem("authCode");

    if (entered === real) {
      localStorage.setItem("authUser", JSON.stringify({ phone }));
      localStorage.removeItem("phoneTemp");

      window.location.href = "/profile";
    } else {
      setError("Неверный код");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f5] flex justify-center items-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-[#eadfd7]">

        <h1 className="text-3xl font-bold text-[#4b2e16] text-center mb-4">
          Авторизация
        </h1>

        <p className="text-center text-[#4b2e16] mb-6">
          Введите код, отправленный на номер<br />
          <b className="text-lg">
            {phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+7 ($2) $3-$4-$5")}
          </b>
        </p>

        {/* Inputs */}
        <div className="flex justify-center gap-4 mb-4">
          {codeInput.map((v, i) => (
            <input
              key={i}
              id={`code-${i}`}
              maxLength={1}
              className="w-14 h-14 text-center border rounded-xl text-2xl bg-[#eef4ff]"
              value={v}
              onChange={(e) => handleInput(e.target.value, i)}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <p
          className="text-center text-[#860120] mt-4 underline cursor-pointer"
          onClick={() => (window.location.href = "/login")}
        >
          Изменить номер телефона
        </p>
      </div>
    </div>
  );
}
