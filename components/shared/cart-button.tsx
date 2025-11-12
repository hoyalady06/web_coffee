'use client';

import { ShoppingCart } from 'lucide-react';

export function CartButton() {
  return (
    <div className="cursor-pointer hover:text-[#860120] transition">
      <ShoppingCart size={22} />
    </div>
  );
}
