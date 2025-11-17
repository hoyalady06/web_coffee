'use client';

import Image from 'next/image';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export function ProductModal({
  open,
  onClose,
  name,
  price,
  image,
  description
}: ProductModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-w-5xl relative animate-fadeIn">
        {/* Кнопка закрыть */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-8 p-8">

          {/* Фото */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl max-w-4xl relative animate-fadeIn"> <Image
                src={image}
                alt={name}
                width={500}
                height={500}
                className="rounded-xl w-full object-contain mx-auto"
              />
            </div>
          </div>

          {/* Текст + кнопки */}
          <div className="w-full md:w-1/2 flex flex-col justify-between min-h-[380px]">

            <div>
              <h2 className="text-3xl font-bold mb-4 text-[#4b2e16]">{name}</h2>

              <p className="text-gray-700 mb-6 leading-relaxed text-[14px]">
                {description || "Описание временно недоступно."}
              </p>

              <p className="font-semibold text-[17px] mb-1">Стоимость:</p>
              <p className="text-[#860120] font-bold text-2xl mb-6">
                {price.toLocaleString('ru-RU')} ₸ / шт
              </p>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                disabled
                className="bg-gray-200 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
              >
                Доступен на самовывоз
              </button>

              <button
                onClick={onClose}
                className="bg-[#860120] hover:bg-[#a4022a] text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Купить сразу
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
