'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const cities = ['Астана', 'Алматы'];

export function CityModal({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (city: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center relative">
        {/* Кнопка “Выбрать позже” */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-sm text-[#4b2e16] hover:text-[#b88b5a] flex items-center gap-1"
        >
          <span></span>
          <X size={16} />
        </button>

        <h2 className="text-2xl font-bold text-[#4b2e16] mb-6">
          Выберите свой город
        </h2>

        <div className="flex flex-col gap-4">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => onSelect(city)}
              className="py-3 rounded-md border border-[#d7b899] hover:bg-[#d7b899]/30 text-[#4b2e16] font-medium text-lg transition"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
