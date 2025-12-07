'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, changeQty, removeFromCart } = useCart();

  // локальное количество для отображения
  const [qty, setQty] = useState(0);

  // Синхронизация карточки с корзиной
  useEffect(() => {
    const item = cart.find((p) => p.id === product.id);
    setQty(item ? item.qty : 0);
  }, [cart]);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`"${product.name}" добавлен в корзину!`);
  };

  const handlePlus = () => {
    changeQty(product.id, qty + 1);
  };

  const handleMinus = () => {
    if (qty === 1) removeFromCart(product.id);
    else changeQty(product.id, qty - 1);
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative">

      {/* КАРТИНКА */}
      <Link href={`/product/${product.id}?from=${product.category}`}>
        <Image
          src={product.image}
          width={500}
          height={500}
          alt={product.name}
          className="w-full object-cover cursor-pointer"
        />
      </Link>

      {/* НИЖНИЙ БЛОК */}
      <div className="px-4 py-4">

        {/* Название + цена */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-medium text-[#4b2e16] truncate max-w-[70%]">
            {product.name}
          </h3>

          <span className="text-[#860120] font-bold text-[16px] whitespace-nowrap">
            {product.price.toLocaleString('ru-RU')} ₸
          </span>
        </div>

        {/* === КНОПКА ИЛИ СЧЁТЧИК === */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full bg-[#860120] hover:bg-[#6c0117] text-white py-2 rounded-xl text-[15px] font-medium transition"
          >
            Заказать
          </button>
        ) : (
          <div className="flex items-center justify-between bg-white border border-[#860120] rounded-xl px-4 py-2">

            <button
              onClick={handleMinus}
              className="text-2xl text-[#860120] font-bold"
            >
              –
            </button>

            <span className="text-lg font-semibold text-[#4b2e16]">{qty}</span>

            <button
              onClick={handlePlus}
              className="text-2xl text-[#860120] font-bold"
            >
              +
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
