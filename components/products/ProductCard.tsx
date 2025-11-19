'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      
      {/* 📌 Картинка → открыть модалку */}
      <div
        onClick={() => onOpenModal(product)}
        className="cursor-pointer"
      >
        <Image
          src={product.image}
          width={300}
          height={300}
          alt={product.name}
          className="rounded-xl mb-3"
        />
      </div>

      <h3 className="font-semibold text-lg">{product.name}</h3>

      <p className="text-[#860120] font-bold mb-3">
        {product.price.toLocaleString('ru-RU')} ₸
      </p>

      {/* 📌 "Заказать" → сразу в корзину */}
      <button
        onClick={() => {
          addToCart(product);
          toast.success(`Продукт "${product.name}" добавлен в корзину!`);
        }}
        className="bg-[#860120] text-white w-full py-2 rounded-lg"
      >
        Заказать
      </button>
    </div>
  );
}
