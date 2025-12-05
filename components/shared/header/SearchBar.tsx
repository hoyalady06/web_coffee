"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-xs lg:max-w-sm">
      <input
        type="text"
        placeholder="Поиск..."
        className="
          w-full
          h-10
          bg-white
          pl-4
          pr-10
          rounded-xl
          shadow-sm
          border border-gray-200
          text-[#4b2e16]
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-[#860120]/40
          transition
        "
      />
      
      <Search
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
      />
    </div>
  );
}
