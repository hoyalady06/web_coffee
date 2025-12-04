'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Instagram, MessageCircle, Send } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#fff9f5] border-t border-[#f1e2da] text-[#4b2e16]">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* 🔹 Логотип и навигация */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 text-center md:text-left">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Image src="/logo.png" alt="Logo" width={90} height={90} />
            <h2 className="text-2xl font-extrabold text-[#860120] tracking-wide">Baked by Saya</h2>
          </Link>

          <nav className="flex flex-wrap justify-center md:justify-start gap-6 font-medium text-[#4b2e16]">
            <Link href="/">{t('menu')}</Link>
            <Link href="/about">{t('about')}</Link>
            <Link href="/contacts">{t('contacts')}</Link>
            
            <Link href="/career">{t('career')}</Link>
            <Link href="/certificate">{t('certificate')}</Link>
          </nav>
        </div>

        {/* 🔹 Контакты и соцсети */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <a
            href="tel:+77715556060"
            className="text-base font-medium text-[#860120] tracking-wide"
          >
            +7 (771) 555 60 60
          </a>
          <div className="flex items-center gap-4 text-[#860120]">
            <Link href="#" className="hover:text-[#860120] transition"><Instagram size={22} /></Link>
            <Link href="#" className="hover:text-[#860120] transition"><MessageCircle size={22} /></Link>
            <Link href="#" className="hover:text-[#860120] transition"><Send size={22} /></Link>
          </div>
        </div>
      </div>

      {/* 🔹 Нижняя полоса */}
      <div className="border-t border-[#f1e2da] text-sm text-center py-4 px-6 flex flex-col md:flex-row justify-between items-center text-[#4b2e16]">
        <div className="flex gap-4">
          <Link href="#" className="hover:text-[#860120] transition">
            {t('userAgreement')}
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="#" className="hover:text-[#860120] transition">
            {t('legalInfo')}
          </Link>
        </div>
        <p className="text-[#4b2e16]">{t('footerInfo')}</p>
      </div>
    </footer>
  );
}
