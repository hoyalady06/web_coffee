"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CatalogLoader } from "@/components/ui/CatalogLoader";

export default function CareerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 📞 Валидация телефона
  const digitsOnly = phone.replace(/\D/g, "");
  const isValidPhone =
    digitsOnly.length === 11 && digitsOnly.startsWith("7");

  async function submit() {
    if (!isValidPhone) return;

    setLoading(true);

    let resume_url: string | null = null;

    // 📎 Загрузка резюме
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `career/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("resumes")
        .upload(path, file);

      if (!error) {
        const { data } = supabase.storage
          .from("resumes")
          .getPublicUrl(path);

        resume_url = data.publicUrl;
      }
    }

    // 📝 Сохранение заявки
    await supabase.from("career_requests").insert({
      name,
      email,
      phone,
      message,
      resume_url,
    });

    setLoading(false);
    setSuccess(true);
  }
  if (loading) {
    return <CatalogLoader />;
  }

if (success) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] px-6">
      <div className="bg-white rounded-3xl shadow-sm border p-10 max-w-md w-full text-center">
        
        {/* Иконка */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#FFFAF9] flex items-center justify-center text-4xl">
            🍰
          </div>
        </div>

        {/* Заголовок */}
        <h2 className="text-3xl font-extrabold text-[#860120] mb-3">
          Спасибо!
        </h2>

        {/* Текст */}
        <p className="text-gray-600 leading-relaxed mb-6">
          Ваше резюме успешно отправлено.
          <br />
          Мы внимательно его рассмотрим и
          <br />
          свяжемся с вами в ближайшее время 
        </p>

        {/* Подпись бренда */}
        <p className="text-sm text-[#4b2e16] font-medium">
          Команда Baked by Saya
        </p>
      </div>
    </div>
  );
}

  

  return (
    <div className="bg-[#fdf9f6] min-h-screen py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-[#860120] mb-12">
          Карьера в Baked by Saya
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#4b2e16]">
              Контакты
            </h2>

            <p className="text-lg font-medium text-[#4b2e16] mb-3">
              Телефон:
            </p>
            <p className="mb-1 text-gray-700">
              +7 (777) 000 00 00 — HR отдел
            </p>
            <p className="mb-1 text-gray-700">
              +7 (700) 000 00 00 — Call-center
            </p>

            <p className="text-lg font-medium text-[#4b2e16] mt-6 mb-3">
              E-mail:
            </p>
            <p className="mb-1 text-gray-700">
              hr@bakedbysaya.kz
            </p>
            <p className="text-gray-700">
              info@bakedbysaya.kz
            </p>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Отправьте ваше резюме, и мы обязательно
              свяжемся с вами.
            </p>

            {/* Имя */}
            <div className="mb-5">
              <label className="block mb-1 font-medium text-[#4b2e16]">
                Как Вас зовут?
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-xl p-4 bg-white"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block mb-1 font-medium text-[#4b2e16]">
                E-mail
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl p-4 bg-white"
              />
            </div>

            {/* Телефон */}
            <div className="mb-5">
              <label className="block mb-1 font-medium text-[#4b2e16]">
                Телефон *
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-xl p-4 bg-white"
              />
              {!isValidPhone && phone && (
                <p className="text-red-500 text-sm mt-1">
                  Введите корректный номер +7…
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-xl p-4 bg-white"
              />
            </div>

            {/* Файл */}
            <label className="flex items-center gap-3 cursor-pointer mb-8">
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />
              <span
                className={`w-[18px] h-[18px] rounded-full border
                  ${
                    file
                      ? "bg-[#860120] border-[#860120]"
                      : "bg-white border-gray-400"
                  }`}
              />
              <span className="font-medium text-gray-700">
                Загрузить резюме {file ? `(${file.name})` : ""}
              </span>
            </label>

            {/* Кнопка */}
            <button
              onClick={submit}
              disabled={!isValidPhone}
              className={`w-full py-4 rounded-xl text-lg font-semibold
                ${
                  isValidPhone
                    ? "bg-[#860120] hover:bg-[#a4022a] text-white"
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
