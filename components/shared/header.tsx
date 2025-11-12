'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { CartButton } from './cart-button';
import { ProfileButton } from './profile-button';
import { CityModal } from '@/components/shared/modals/CityModal';

export function Header() {
  const [city, setCity] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setCity(savedCity);
    } else {
      setModalOpen(true);
    }

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
      <div className="container mx-auto flex flex-wrap items-center justify-between py-4 px-6 gap-4">
        {/* ЛОГОТИП */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={38} height={38} />
          <h1 className="text-2xl uppercase font-black text-[#4b2e16]">CoffeeTime</h1>
        </Link>

        {/* ЦЕНТР МЕНЮ */}
        <nav className="hidden md:flex items-center gap-8 text-[#4b2e16] font-medium">
          <Link href="/">Меню</Link>
          <Link href="/about">О нас</Link>
          <Link href="/contacts">Контакты</Link>
          <Link href="/franchise">Франчайзинг</Link>
        </nav>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex items-center gap-5 text-[#4b2e16]">
          {/* ЯЗЫК */}
          <button className="flex items-center gap-1 hover:text-[#b88b5a] transition">
            <span>Рус</span>
            <svg width="10" height="6" fill="currentColor" viewBox="0 0 10 6">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>

          {/* ГОРОД */}
          <button
            onClick={() => setModalOpen(true)}
            className={`flex items-center gap-2 transition ${
              city ? 'text-[#4b2e16]' : 'text-[#0097a7]'
            } hover:text-[#b88b5a]`}
          >
            <MapPin size={18} />
            <span>{city || 'Выберите город'}</span>
          </button>

          {/* ПРОФИЛЬ / КОРЗИНА */}
          <ProfileButton onClickSignIn={() => {}} />
          <CartButton />
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО */}
      {modalOpen && (
        <CityModal
          open={modalOpen}
          onSelect={handleSelectCity}
          onClose={handleCloseModal}
        />
      )}
    </header>
  );
}
