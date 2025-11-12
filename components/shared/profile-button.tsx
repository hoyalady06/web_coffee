'use client';

import { User } from 'lucide-react';

export function ProfileButton({ onClickSignIn }: { onClickSignIn: () => void }) {
  return (
    <div
      onClick={onClickSignIn}
      className="cursor-pointer hover:text-[#b88b5a] transition"
    >
      <User size={22} />
    </div>
  );
}
