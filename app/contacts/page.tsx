'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function ContactsPage() {
  const [openCity, setOpenCity] = useState<string | null>('astana');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleCity = (city: string) => {
    setOpenCity(openCity === city ? null : city);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !phone) return;

    setLoading(true);

    const { error } = await supabase
      .from('contact_requests')
      .insert({
        name,
        phone,
        email,
        message,
      });

    setLoading(false);

    if (!error) {
      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } else {
      alert('Ошибка отправки');
    }
  }

  /* ===== SUCCESS ===== */
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
          Ваше сообщение успешно отправлено.
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
    <main className="min-h-screen bg-[#FFFAF9] text-[#4b2e16]">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#860120] mb-8">
          Контакты
        </h1>

        {/* ===== ГОРОДА ===== */}
        <div className="space-y-4 mb-12">
          {/* АСТАНА */}
          <div className="border border-[#e7d8d1] rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCity('astana')}
              className="w-full text-left px-6 py-4 flex justify-between items-center text-xl font-semibold bg-white"
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
                    map: 'https://www.google.com/maps?q=51.128536,71.419612&output=embed',
                  },
                  {
                    address: 'ул. Айтеке би, 11 (Кристалл)',
                    time: '09:00 — 22:00',
                    phone: '+7 (705) 755-96-20',
                    map: 'https://www.google.com/maps?q=51.125932,71.433041&output=embed',
                  },
                  {
                    address: 'пр-т Кабанбай батыра, 9/2',
                    time: '08:00 — 21:00',
                    phone: '+7 (705) 755-00-46',
                    map: 'https://www.google.com/maps?q=51.127511,71.441019&output=embed',
                  },
                ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-[#860120] font-semibold mb-2">
                    <MapPin size={18} />
                    {item.address}
                  </div>
                  <p className="text-sm">{item.time}</p>
                  <p className="font-medium mt-1 mb-3">{item.phone}</p>

                  {/* КАРТА */}
                  <iframe
                    src={item.map}
                    className="w-full h-40 rounded-lg"
                    loading="lazy"
                    style={{ border: 0 }}
                  />
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
                  map: 'https://www.google.com/maps?q=43.197472,76.895347&output=embed',
                },
                {
                  address: 'ул. Черепанова, 14а',
                  time: '08:00 — 20:00',
                  phone: '+7 (708) 848-57-02',
                  map: 'https://www.google.com/maps?q=43.258879,76.913570&output=embed',
                },
                {
                  address: 'ул. Райымбека, 168Б (Бесағаш)',
                  time: '08:00 — 21:00',
                  phone: '+7 (708) 841-06-75',
                  map: 'https://www.google.com/maps?q=43.319883,76.857550&output=embed',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-2 text-[#860120] font-semibold mb-2">
                      <MapPin size={18} />
                      {item.address}
                    </div>
                    <p className="text-sm">{item.time}</p>
                    <p className="font-medium mt-1 mb-3">
                      {item.phone}
                    </p>
                    <iframe
                      src={item.map}
                      className="w-full h-40 rounded-lg"
                      loading="lazy"
                      style={{ border: 0 }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== ФОРМА ===== */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* ЛЕВАЯ */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#860120]">
              Связаться с нами
            </h2>
            <p className="mb-3">
              Телефон: <strong>+7 (705) 755 00 01</strong>
            </p>
            <p className="mb-3">
              E-mail: <strong>bakedbysaya@gmail.com</strong>
            </p>
            <p>Мы ответим в течение 24 часов 💌</p>
          </div>

          {/* ПРАВАЯ */}
          <form
            onSubmit={submit}
            className="bg-white p-6 rounded-xl shadow-md space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Имя
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Телефон
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="+7 ___ ___ __ __"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                E-mail
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Сообщение
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#860120] text-white font-semibold py-2 rounded-lg hover:bg-[#a82121] transition"
            >
              {loading ? 'Отправляем…' : 'Отправить'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
