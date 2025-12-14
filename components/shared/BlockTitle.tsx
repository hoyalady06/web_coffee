"use client";

interface BlockTitleProps {
  icon?: string;
  title: string;
}

export function BlockTitle({ icon, title }: BlockTitleProps) {
  return (
    <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#fff4ef] border border-[#eadfd7] rounded-2xl shadow-sm mb-8">
      {icon && <span className="text-2xl">{icon}</span>}
      <h2 className="text-2xl font-semibold text-[#4b2e16]">{title}</h2>
    </div>
  );
}
