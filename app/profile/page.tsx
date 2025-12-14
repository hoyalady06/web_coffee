"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfileMainPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    birthday: "",
  });

  // -------------------------------
  // LOAD USER
  // -------------------------------
  useEffect(() => {
    const uid = localStorage.getItem("user_id");

    if (!uid) {
      window.location.href = "/login";
      return;
    }

    async function loadUser() {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", uid)
        .single();

      if (!error && data) {
        setUser(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          birthday: data.birthday || "",
        });
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  // -------------------------------
  // SAVE
  // -------------------------------
  async function saveProfile() {
    const uid = localStorage.getItem("user_id");

    const { error } = await supabase
      .from("users")
      .update(form)
      .eq("id", uid);

    if (error) {
      alert("Ошибка сохранения");
      return;
    }

    setUser({ ...user, ...form });
    setIsEditing(false);
  }

  // -------------------------------
  // UI
  // -------------------------------
  if (loading) return <div>Загрузка…</div>;
  if (!user) return <div>Ошибка: пользователь не найден.</div>;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-[#4b2e16] mb-10">
        Личная информация
      </h1>

      {!isEditing ? (
        <>
          <Data label="Имя" value={user.name || "Не указано"} />
          <Data label="Телефон" value={user.phone || "Не указан"} />
          <Data label="Дата рождения" value={user.birthday || "Не указана"} />

          <Data
            label="Пол"
            value={
              user.gender === "male"
                ? "Мужской"
                : user.gender === "female"
                ? "Женский"
                : "Не указан"
            }
          />

          <button
            onClick={() => setIsEditing(true)}
            className="mt-10 bg-[#860120] text-white w-full py-3 rounded-xl hover:bg-[#6b011a] transition"
          >
            Редактировать
          </button>
        </>
      ) : (
        <>
          <Input
            label="Имя"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Input
            label="Телефон"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          <Input
            label="Дата рождения"
            type="date"
            value={form.birthday}
            onChange={(v) => setForm({ ...form, birthday: v })}
          />

          <label className="block mb-2 text-gray-600">Пол</label>
          <select
            className="w-full p-3 mb-6 border rounded-xl bg-[#FFF6F7]"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Не указан</option>
            <option value="female">Женский</option>
            <option value="male">Мужской</option>
          </select>

          <button
            onClick={saveProfile}
            className="mt-4 bg-[#860120] text-white w-full py-3 rounded-xl"
          >
            Сохранить
          </button>

          <button
            onClick={() => setIsEditing(false)}
            className="mt-3 text-gray-600 underline w-full text-center"
          >
            Отмена
          </button>
        </>
      )}
    </div>
  );
}

// -------------------------------
// COMPONENTS
// -------------------------------

function Data({ label, value }: any) {
  return (
    <div className="mb-6">
      <p className="text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-[#4b2e16]">{value}</p>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-xl bg-[#FFF6F7]"
      />
    </div>
  );
}
//GOooooo