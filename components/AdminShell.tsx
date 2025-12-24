"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-6 py-10 flex gap-8">
      {/* Левая колонка */}
      <AdminSidebar />

      {/* Правая карточка (как профиль) */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border p-10">
        {children}
      </div>
    </div>
  );
}
