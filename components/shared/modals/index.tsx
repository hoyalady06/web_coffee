'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

// ✅ Именованный экспорт
export function AuthModal({ open, onClose }: AuthModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Авторизация</h2>
        <p className="mb-4">Здесь будет форма входа</p>
        <Button onClick={onClose}>Закрыть</Button>
      </div>
    </div>
  );
}
