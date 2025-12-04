"use client";

import { useEffect, useState } from "react";
import { User, LogOut, Edit } from "lucide-react";

// формат номера с +7
function formatPhone(num: string) {
  if (!num) return "";
  const digits = num.replace(/\D/g, "");

  return digits.replace(
    /^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/,
    "+7 ($2) $3-$4-$5"
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      setEditName(u.name || "");
      setEditPhone(formatPhone(u.phone));
    }
  }, []);

  const saveProfile = () => {
    // сохраняем телефон в цифрах
    const cleanPhone = editPhone.replace(/\D/g, "");

    const updated = {
      name: editName,
      phone: cleanPhone
    };

    localStorage.setItem("authUser", JSON.stringify(updated));
    setUser(updated);
    setEditMode(false);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Вы не авторизованы
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f5] flex justify-center pt-24 pb-16 px-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-[#eadfd7]">

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#4b2e16]">Профиль</h1>
          <button
            className="text-[#860120] flex items-center gap-2"
            onClick={() => setEditMode(!editMode)}
          >
            <Edit size={18} />
            Изменить
          </button>
        </div>

        <div className="mt-6 space-y-6">

          {/* AVATAR */}
          <div className="w-24 h-24 bg-[#f2ece7] rounded-full flex items-center justify-center mx-auto">
            <User size={40} className="text-[#4b2e16]" />
          </div>

          {/* NAME FIELD */}
          <div>
            <label className="text-[#4b2e16] font-medium">Имя</label>
            {editMode ? (
              <input
                className="w-full mt-1 px-4 py-3 rounded-xl border border-[#eadfd7]"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            ) : (
              <p className="mt-1 text-lg font-semibold text-[#4b2e16]">
                {user.name || "Без имени"}
              </p>
            )}
          </div>

          {/* PHONE FIELD */}
          <div>
            <label className="text-[#4b2e16] font-medium">Телефон</label>
            {editMode ? (
              <input
                className="w-full mt-1 px-4 py-3 rounded-xl border border-[#eadfd7]"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            ) : (
              <p className="mt-1 text-lg font-semibold text-[#4b2e16]">
                {formatPhone(user.phone)}
              </p>
            )}
          </div>

          {/* SAVE BUTTON */}
          {editMode && (
            <button
              onClick={saveProfile}
              className="w-full bg-[#860120] hover:bg-[#6b011a] text-white font-semibold py-3 rounded-xl"
            >
              Сохранить
            </button>
          )}

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="w-full border mt-4 border-red-500 text-red-600 py-3 rounded-xl"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
