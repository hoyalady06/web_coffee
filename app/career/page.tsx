"use client";

import { useState } from "react";

export default function CareerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("");

  // Валидация телефона — как на оформлении заказа
  const digitsOnly = phone.replace(/\D/g, "");
  const isValidPhone = digitsOnly.length === 11 && digitsOnly.startsWith("7");

  return (
    <div className="bg-[#fdf9f6] min-h-screen py-16">
      <div className="container mx-auto px-6">
        {/* Заголовок */}
        <h1 className="text-4xl font-extrabold text-[#860120] mb-12">
          Карьера в Baked by Saya
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* ЛЕВАЯ ЧАСТЬ — КОНТАКТЫ */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#4b2e16]">Контакты</h2>

            <p className="text-lg font-medium text-[#4b2e16] mb-3">Телефон:</p>
            <p className="mb-1 text-gray-700">+7 (777) 000 00 00 — HR отдел</p>
            <p className="mb-1 text-gray-700">+7 (700) 000 00 00 — Call-center</p>

            <p className="text-lg font-medium text-[#4b2e16] mt-6 mb-3">E-mail:</p>
            <p className="mb-1 text-gray-700">hr@bakedbysaya.kz</p>
            <p className="text-gray-700">info@bakedbysaya.kz</p>
          </div>

          {/* ПРАВАЯ ЧАСТЬ — ФОРМА */}
          <div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Отправьте ваше резюме, и мы обязательно свяжемся с вами.
              Мы ищем талантливых, добрых и ответственных людей,
              которые хотят стать частью команды Baked by Saya.
            </p>

            {/* Имя */}
            <div className="mb-5">
              <label className="block mb-1 font-medium text-[#4b2e16]">
                Как Вас зовут?
              </label>
              <input
                type="text"
                placeholder="Имя"
                className="w-full border rounded-xl p-4 bg-white focus:outline-[#860120] focus:ring-[#860120]"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block mb-1 font-medium text-[#4b2e16]">
                E-mail
              </label>
              <input
                type="email"
                placeholder="Введите e-mail"
                className="w-full border rounded-xl p-4 bg-white focus:outline-[#860120]"
              />
            </div>

            {/* Телефон с условием */}
            <div className="mb-5">
              <label className="block mb-1 font-medium text-[#4b2e16]">
                Телефон *
              </label>
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-xl p-4 bg-white focus:outline-[#860120]"
              />
              {!isValidPhone && phone.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  Введите корректный номер телефона в формате +7…
                </p>
              )}
            </div>

            {/* Сообщение */}
            <div className="mb-5">
              <label className="block mb-1 font-medium text-[#4b2e16]">
                Сообщение
              </label>
              <textarea
                rows={5}
                placeholder="Ваше сообщение"
                className="w-full border rounded-xl p-4 bg-white focus:outline-[#860120]"
              />
            </div>

            {/* Загрузить файл */}
            {/* Загрузить файл */}
            <label className="flex items-center gap-3 cursor-pointer mt-2 mb-8">
            <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {/* Точка-индикатор */}
            <span
                className={`
                w-[18px] h-[18px] rounded-full border 
                transition-all duration-200
                ${file ? "bg-[#860120] border-[#860120]" : "bg-white border-gray-400"}
                `}
            />

            {/* Текст */}
            <span className="font-medium text-gray-700">
                Загрузить резюме {file ? `(${file.name})` : ""}
            </span>
            </label>


            {/* Кнопка отправки с условием */}
            <button
              disabled={!isValidPhone}
              className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition
                ${
                  isValidPhone
                    ? "bg-[#860120] hover:bg-[#a4022a] text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
