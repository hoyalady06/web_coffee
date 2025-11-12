'use client';

import Image from 'next/image';
import { useState } from 'react';

const fmt = new Intl.NumberFormat('ru-RU');

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  description?: string;
  onOrder?: () => void;   // <<< ВАЖНО: теперь компонент знает про onOrder
}

export function ProductCard({ name, price, image, description, onOrder }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg p-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Фото */}
      <div className="relative w-full h-56 mb-3">
        <Image src={image} alt={name} fill className="object-cover rounded-lg" />
      </div>

      {/* Название и цена */}
      <div className="flex items-center justify-between text-[#4b2e16] font-medium mb-3">
        <span>{name}</span>
        <span className="font-semibold">{fmt.format(price)} ₸</span>
      </div>

      {/* Кнопка при наведении */}
      <div className={`transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <button
          onClick={onOrder}
          className="w-full bg-[#860120] text-white py-2 rounded-lg font-semibold hover:bg-[#a82121] transition"
        >
          Заказать
        </button>
      </div>
    </div>
  );
}
