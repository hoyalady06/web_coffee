'use client';

import { User } from 'lucide-react';

export function ProfileButton({ onClickSignIn }: { onClickSignIn: () => void }) {
  return (
    <div
      onClick={onClickSignIn}
      className="cursor-pointer hover:text-[#860120] transition"
    >
      <User size={22} />
    </div>
  );
}
