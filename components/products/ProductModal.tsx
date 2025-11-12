'use client';

import Image from 'next/image';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  price: number;
  image: string;
  description: string;
}

export function ProductModal({ open, onClose, name, price, image, description }: ProductModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative animate-fadeIn">
        {/* Закрыть */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          ✕
        </button>

        {/* Контент */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
          {/* Фото */}
          <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center">
            <Image
              src={image}
              alt={name}
              width={300}
              height={300}
              className="rounded-xl bg-[#fff5f0] p-4"
            />
          </div>

          {/* Текст */}
          <div className="flex-1 text-[#4b2e16]">
            <h2 className="text-2xl font-bold mb-3">{name}</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>

            <p className="font-semibold mb-1">Стоимость:</p>
            <p className="text-[#860120] font-bold text-lg mb-5">{price.toLocaleString('ru-RU')} ₸ / шт</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                Доступен на самовывоз
              </button>
              <button
                onClick={onClose}
                className="bg-[#860120] hover:bg-[#860130] text-white font-semibold py-2 px-6 rounded-lg transition"
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
