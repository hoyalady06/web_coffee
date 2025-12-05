"use client";

import { useEffect, useState } from "react";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { AlertTriangle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // временные поля для формы
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    birthday: ""
  });

  useEffect(() => {
    const u = localStorage.getItem("authUser");
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
      setForm({
        name: parsed.name || "",
        phone: parsed.phone || "",
        gender: parsed.gender || "",
        birthday: parsed.birthday || ""
      });
    }
  }, []);

  if (!user)
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;

  return (
    <div className="container mx-auto px-6 py-10 flex gap-10">

      {/* SIDEBAR */}
      <ProfileSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-white rounded-2xl border border-[#eadfd7] shadow-sm p-10">

        {/* ---------------- VIEW MODE ---------------- */}
        {!isEditing && (
          <>
            <h2 className="text-2xl font-bold text-[#4b2e16] mb-6">Учётные данные</h2>

            <div className="bg-[#f7f8ff] border border-[#e3e7ff] rounded-xl p-4 mb-8 flex items-center gap-3">
              <AlertTriangle className="text-[#d65a63]" size={22} />
              <p className="text-[#d65a63] text-[15px] font-medium">
                Укажите недостающие данные, чтобы защитить свой аккаунт
              </p>
            </div>

            {/* PROFILE INFO */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-20 text-[17px]">
              <div>
                <p className="text-gray-500">ФИО</p>
                <p className="font-semibold text-[#4b2e16]">{user.name}</p>
              </div>

              <div>
                <p className="text-gray-500">Телефон</p>
                <p className="font-semibold text-[#4b2e16]">+7 {user.phone?.slice(1)}</p>
              </div>

              <div>
                <p className="text-gray-500">Дата рождения</p>
                <p className="font-semibold text-[#4b2e16]">
                  {user.birthday || "Не указана"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Пол</p>
                <p className="font-semibold text-[#4b2e16]">
                  {user.gender === "female"
                    ? "Женский"
                    : user.gender === "male"
                    ? "Мужской"
                    : "Не указан"}
                </p>
              </div>
            </div>

            {/* кнопка */}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 text-[#2668ff] hover:underline font-medium text-[15px]"
            >
              Изменить данные
            </button>
          </>
        )}

        {/* ---------------- EDIT MODE ---------------- */}
        {isEditing && (
          <>
            <h2 className="text-2xl font-bold text-[#4b2e16] mb-6">Редактирование профиля</h2>

            <div className="space-y-6 max-w-lg">

              {/* Имя */}
              <div>
                <p className="text-gray-500 mb-1">Имя</p>
                <input
                  className="w-full border border-[#eadfd7] rounded-lg p-3 text-[16px]"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Пол */}
              <div>
                <p className="text-gray-500 mb-1">Пол</p>
                <select
                  className="w-full border border-[#eadfd7] rounded-lg p-3 text-[16px]"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Не указан</option>
                  <option value="female">Женский</option>
                  <option value="male">Мужской</option>
                </select>
              </div>

              {/* Телефон */}
              <div>
                <p className="text-gray-500 mb-1">Телефон</p>
                <input
                  className="w-full border border-[#eadfd7] rounded-lg p-3 text-[16px]"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              {/* Дата рождения */}
              <div>
                <p className="text-gray-500 mb-1">Дата рождения</p>
                <input
                  type="date"
                  className="w-full border border-[#eadfd7] rounded-lg p-3 text-[16px]"
                  value={form.birthday}
                  onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-8">
            <button
              className="bg-[#860120] text-white px-6 py-3 rounded-xl"
              onClick={() => {
                localStorage.setItem("authUser", JSON.stringify(form));
                setUser(form);
                setIsEditing(false);
                window.location.reload(); // <<< ДОБАВЛЯЕМ ЭТО
              }}
            >
              Сохранить
            </button>


              <button
                className="text-gray-600 hover:underline"
                onClick={() => setIsEditing(false)}
              >
                Отмена
              </button>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
