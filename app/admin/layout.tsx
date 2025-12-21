"use client";

import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-6 py-10 flex gap-10">
      <AdminSidebar />

      <div className="flex-1">
        <div className="bg-white rounded-2xl border border-[#FFFAF9] shadow-sm p-10 min-h-[600px]">
          {children}
        </div>
      </div>
    </div>
  );
}
