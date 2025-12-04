"use client";

import React from "react";
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneInputField({ value, onChange }: Props) {
  return (
    <PhoneInput
      defaultCountry="KZ"
      value={value}
      onChange={(v) => onChange(v || "")}
      className="w-full px-4 py-3 rounded-xl border border-[#e3d6cd] bg-[#fffaf7]
      focus:outline-none focus:ring-2 focus:ring-[#860120] transition"
    />
  );
}
