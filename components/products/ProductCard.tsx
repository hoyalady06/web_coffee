'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, changeQty, removeFromCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [qty, setQty] = useState(0);

  useEffect(() => {
    const item = cart.find((p) => p.id === product.id);
    setQty(item ? item.qty : 0);
  }, [cart]);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`"${product.name}" добавлен в корзину!`);
  };

  const handlePlus = () => changeQty(product.id, qty + 1);
  const handleMinus = () =>
    qty === 1 ? removeFromCart(product.id) : changeQty(product.id, qty - 1);

  return (
    <div className="relative bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">

      {/* ❤️ СЕРДЕЧКО */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product);
        }}
        className="absolute top-3 right-3 z-20"
      >
        <Heart
          size={26}
          className={
            isFavorite(product.id)
              ? "fill-[#860120] text-[#860120]"
              : "text-[#860120]"
          }
        />
      </button>

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

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-medium text-[#4b2e16] truncate max-w-[70%]">
            {product.name}
          </h3>

          <span className="text-[#860120] font-bold text-[16px] whitespace-nowrap">
            {product.price.toLocaleString('ru-RU')} ₸
          </span>
        </div>

        {/* КНОПКА / СЧЁТЧИК */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full bg-[#860120] hover:bg-[#6c0117] text-white py-2 rounded-xl text-[15px] font-medium transition"
          >
            Заказать
          </button>
        ) : (
          <div className="flex items-center justify-between bg-white border border-[#860120] rounded-xl px-4 py-2">
            <button onClick={handleMinus} className="text-2xl text-[#860120] font-bold">–</button>
            <span className="text-lg font-semibold text-[#4b2e16]">{qty}</span>
            <button onClick={handlePlus} className="text-2xl text-[#860120] font-bold">+</button>
          </div>
        )}
      </div>
    </div>
  );
}
