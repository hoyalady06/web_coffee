'use client';

import { ShoppingCart } from 'lucide-react';

export function CartButton() {
  return (
    <div className="cursor-pointer hover:text-[#b88b5a] transition">
      <ShoppingCart size={22} />
    </div>
  );
}
