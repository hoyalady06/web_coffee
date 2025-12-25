"use client";

import { ReactNode } from "react";
import { ManagerSidebar } from "./ManagerSidebar";

export function ManagerShell({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-6 py-10 flex gap-8">
      {/* Левая колонка */}
      <ManagerSidebar />

      {/* Правая карточка */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border p-10">
        {children}
      </div>
    </div>
  );
}
