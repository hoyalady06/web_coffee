'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { CartButton } from './cart-button';
import { ProfileButton } from './profile-button';
import { CityModal } from '@/components/shared/modals/CityModal';
import { useLanguage } from '@/context/LanguageContext';
import { SearchBar } from "components/shared/header/SearchBar";
import CartDrawer from '../cart/CartDrawer';
import { useCart } from '@/context/CartContext';


export function Header() {
  const [city, setCity] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [authOpen, setAuthOpen] = useState(false); // 🔥 NEW

  const { language, setLanguage, t } = useLanguage();
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-[#fff9f5] shadow-md">

      <div className="container mx-auto flex items-center justify-between py-0 px-6">

        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={100} height={80} />
          <h1 className="text-2xl font-extrabold text-[#860120] tracking-wide">
            Baked by Saya
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-[#4b2e16] font-medium text-[15px]">
          <Link href="/category/cakes">{t('menu')}</Link>
          <Link href="/about">{t('about')}</Link>
          <Link href="/contacts">{t('contacts')}</Link>
          <Link href="/certificate">{t('certificate')}</Link>
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Language */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage('ru')}
              className={language === 'ru' ? 'text-[#860120]' : 'text-[#4b2e16]'}
            >
              Рус
            </button>
            <span className="text-[#4b2e16]">/</span>
            <button
              onClick={() => setLanguage('kk')}
              className={language === 'kk' ? 'text-[#860120]' : 'text-[#4b2e16]'}
            >
              Қаз
            </button>
          </div>

          {/* City */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 text-[#860120]"
          >
            <MapPin size={18} />
            <span>{city || t('chooseCity')}</span>
          </button>

          {/* Profile + Cart */}
          {/* Profile + Cart */}
          <div className="flex items-center gap-4">
            <ProfileButton />           {/* ⬅️ БЕЗ Link вокруг */}
            <CartButton onClick={() => setOpenCart(true)} />
          </div>

        </div>
      </div>

      {/* City Modal */}
      {modalOpen && (
        <CityModal
          open={modalOpen}
          onSelect={(c) => {
            localStorage.setItem('selectedCity', c);
            setCity(c);
            setModalOpen(false);
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />


    </header>
  );
}
