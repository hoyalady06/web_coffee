'use client';

export function CatalogLoader() {
  return (
    <div className="h-[40vh] flex flex-col items-center justify-center">
      <div className="text-6xl animate-pulse mb-4">🍰</div>

      <p className="text-lg text-[#4b2e16] font-medium">
        Готовим ваш десерт
        <span className="inline-block ml-1 animate-bounce">.</span>
        <span className="inline-block ml-1 animate-bounce [animation-delay:150ms]">.</span>
        <span className="inline-block ml-1 animate-bounce [animation-delay:300ms]">.</span>
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Это займёт пару секунд
      </p>
    </div>
  );
}
