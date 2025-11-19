'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function CartButton({ onClick }: { onClick?: () => void }) {
  const { cart } = useCart();

  // считаем количество товаров
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer hover:text-[#860120] transition"
    >
      <ShoppingCart size={22} />

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#860120] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
}
