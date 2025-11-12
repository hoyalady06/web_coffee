'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { CartButton } from './cart-button';
import { ProfileButton } from './profile-button';
import { CityModal } from '@/components/shared/modals/CityModal';
import { useLanguage } from '@/context/LanguageContext';

export function Header() {
  const [city, setCity] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) setCity(savedCity);
    else setModalOpen(true);

    const handleCityChange = () => {
      const newCity = localStorage.getItem('selectedCity');
      setCity(newCity);
    };

    window.addEventListener('cityChange', handleCityChange);
    return () => window.removeEventListener('cityChange', handleCityChange);
  }, []);

  const handleSelectCity = (cityName: string) => {
    localStorage.setItem('selectedCity', cityName);
    window.dispatchEvent(new Event('cityChange'));
    setCity(cityName);
    setModalOpen(false);
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <header className="border-b bg-[#fff9f5]">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* 🌸 ЛОГО */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={100} height={80} />
          <h1 className="text-2xl font-extrabold text-[#860120] tracking-wide">
            Baked by Saya
          </h1>
        </Link>

        {/* 🌿 МЕНЮ */}
        <nav className="hidden md:flex items-center gap-10 text-[#4b2e16] font-medium text-[15px]">
          <Link href="/">{t('menu')}</Link>
          <Link href="/about">{t('about')}</Link>
          <Link href="/contacts">{t('contacts')}</Link>
          <Link href="/franchise">{t('franchise')}</Link>
        </nav>

        {/* ☕ ПРАВАЯ ЧАСТЬ */}
        <div className="flex items-center gap-5">
          {/* 🌐 ЯЗЫК */}
<div className="flex items-center gap-2">
  <button
    onClick={() => setLanguage('ru')}
    className={`transition font-semibold ${
      language === 'ru'
        ? 'text-[#860120]'
        : 'text-[#4b2e16] hover:text-[#860120]'
    }`}
  >
    Рус
  </button>
  <span className="text-[#4b2e16]">/</span>
  <button
    onClick={() => setLanguage('kk')}
    className={`transition font-semibold ${
      language === 'kk'
        ? 'text-[#860120]'
        : 'text-[#4b2e16] hover:text-[#860120]'
    }`}
  >
    Қаз
  </button>
</div>

          {/* 📍 ГОРОД */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 text-[#860120] hover:text-[#a63d4e] transition"
          >
            <MapPin size={18} />
            <span className="font-medium">{city || t('chooseCity')}</span>
          </button>

          {/* 👤 и 🛒 */}
          <div className="flex items-center gap-4">
            <ProfileButton onClickSignIn={() => {}} />
            <CartButton />
          </div>
        </div>
      </div>

      {/* 🪟 МОДАЛЬНОЕ ОКНО ГОРОДА */}
      {modalOpen && (
        <CityModal open={modalOpen} onSelect={handleSelectCity} onClose={handleCloseModal} />
      )}
    </header>
  );
}
