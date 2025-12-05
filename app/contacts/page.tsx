'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

export default function ContactsPage() {
  const [openCity, setOpenCity] = useState<string | null>('astana');

  const toggleCity = (city: string) => {
    setOpenCity(openCity === city ? null : city);
  };

  return (
    <main className="min-h-screen bg-[#fff9f5] text-[#4b2e16]">
      <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-[#860120] mb-8">Контакты</h1>

        {/* ===== Города ===== */}
        <div className="space-y-4 mb-12">
          {/* --- АСТАНА --- */}
          <div className="border border-[#e7d8d1] rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCity('astana')}
              className="w-full text-left px-6 py-4 flex justify-between items-center text-xl font-semibold bg-white transition"
            >
              Астана
              <span>{openCity === 'astana' ? '−' : '+'}</span>
            </button>

            {openCity === 'astana' && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-white">
                {[
                  {
                    address: 'ул. Кунаева, 14Г (ЖК “Нурсая”)',
                    time: '08:00 — 21:30',
                    phone: '+7 (705) 755-68-15',
                  },
                  {
                    address: 'ул. Айтеке би, 11 (Кристалл)',
                    time: '09:00 — 22:00',
                    phone: '+7 (705) 755-96-20',
                  },
                  {
                    address: 'пр-т Кабанбай батыра, 9/2',
                    time: '08:00 — 21:00',
                    phone: '+7 (705) 755-00-46',
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-2 text-[#860120] font-semibold mb-2">
                      <MapPin size={18} />
                      {item.address}
                    </div>
                    <p className="text-sm">{item.time}</p>
                    <p className="font-medium mt-1">{item.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- АЛМАТЫ --- */}
          <div className="border border-[#e7d8d1] rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCity('almaty')}
              className="w-full text-left px-6 py-4 flex justify-between items-center text-xl font-semibold bg-white transition"
            >
              Алматы
              <span>{openCity === 'almaty' ? '−' : '+'}</span>
            </button>

            {openCity === 'almaty' && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-white">
                {[
                  {
                    address: 'ул. Розыбакиева, 247а (Mega Center Alma-Ata)',
                    time: '10:00 — 24:00',
                    phone: '+7 (747) 242-17-79',
                  },
                  {
                    address: 'ул. Черепанова, 14а',
                    time: '08:00 — 20:00',
                    phone: '+7 (708) 848-57-02',
                  },
                  {
                    address: 'ул. Райымбека, 168Б (Бесағаш)',
                    time: '08:00 — 21:00',
                    phone: '+7 (708) 841-06-75',
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-2 text-[#860120] font-semibold mb-2">
                      <MapPin size={18} />
                      {item.address}
                    </div>
                    <p className="text-sm">{item.time}</p>
                    <p className="font-medium mt-1">{item.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== Контактная форма ===== */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* 📞 Левая часть */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#860120]">Связаться с нами</h2>
            <p className="mb-3">Телефон: <strong>+7 (705) 755 00 01</strong></p>
            <p className="mb-3">E-mail: <strong>bakedbysaya@gmail.com</strong></p>
            <p>Мы ответим на ваш запрос в течение 24 часов 💌</p>
          </div>

          {/* ✉️ Правая часть */}
          <form className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Имя</label>
              <input type="text" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#860120]" />
            </div>
              {/* 📱 Телефон */}
            <div>
                <label className="block text-sm font-medium mb-1">Телефон</label>
                <input
                type="tel"
                pattern="^\+?[0-9\s\-]{10,15}$"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#860120]"
                placeholder="+7 ___ ___ __ __"
                required
                />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input type="email" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#860120]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Сообщение</label>
              <textarea rows={4} className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#860120]" />
            </div>
            <button
              type="submit"
              className="w-full bg-[#860120] text-white font-semibold py-2 rounded-lg hover:bg-[#a82121] transition"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
