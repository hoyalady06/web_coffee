'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import type { Product } from '@/data/products';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Изображение */}
      <Link href={`/product/${product.id}?from=${product.category}`}>
        <Image
          src={product.image}
          width={500}
          height={500}
          alt={product.name}
          className="w-full object-cover cursor-pointer"
        />
      </Link>

      {/* Текстовая зона */}
      <div className="px-4 py-4">

        {/* НАЗВАНИЕ + ЦЕНА в одной строке */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-medium text-[#4b2e16] truncate max-w-[70%]">
            {product.name}
          </h3>

          <span className="text-[#860120] font-bold text-[16px] whitespace-nowrap">
            {product.price.toLocaleString('ru-RU')} ₸
          </span>
        </div>

        {/* Кнопка */}
        <button
          onClick={() => {
            addToCart(product);
            toast.success(`"${product.name}" добавлен в корзину!`);
          }}
          className="w-full bg-[#860120] hover:bg-[#6c0117] text-white py-2 rounded-xl text-[15px] font-medium transition"
        >
          Заказать
        </button>
      </div>
    </div>
  );
}
