"use client";

import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneInputMask({ value, onChange }: Props) {
  // Маска форматирования номера
  const formatPhone = (phone: string) => {
    // Удаляем всё, кроме цифр
    const digits = phone.replace(/\D/g, "");

    let formatted = "+7 ";

    if (digits.length > 1) {
      formatted += `(${digits.substring(1, 4)}`;
    }
    if (digits.length >= 4) {
      formatted += `) ${digits.substring(4, 7)}`;
    }
    if (digits.length >= 7) {
      formatted += `-${digits.substring(7, 9)}`;
    }
    if (digits.length >= 9) {
      formatted += `-${digits.substring(9, 11)}`;
    }

    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Только цифры
    const digits = input.replace(/\D/g, "");

    // Ограничиваем длину: +7 (XXX) XXX-XX-XX = 11 цифр
    if (digits.length > 11) return;

    onChange(formatPhone(digits));
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      placeholder="+7 (___) ___-__-__"
      className="w-full px-4 py-3 rounded-xl border border-[#e3d6cd] bg-[#fffaf7]
      focus:outline-none focus:ring-2 focus:ring-[#860120] transition"
    />
  );
}
