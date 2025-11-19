'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/products';
import toast from 'react-hot-toast';

interface ProductModalProps {
  product: Product | null;   // что за товар показываем
  onClose: () => void;       // функция закрытия модалки
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();

  // если товара нет — модалку не показываем
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full relative p-8">

        {/* ✖ Кнопка закрыть */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-8">

          {/* 🖼 Фото товара */}
          <div className="md:w-1/2 flex justify-center">
            <Image
              src={product.image}
              width={500}
              height={500}
              alt={product.name}
              className="rounded-xl"
            />
          </div>

          {/* ℹ️ Описание + кнопки */}
          <div className="md:w-1/2 flex flex-col justify-between">

            <div>
              <h2 className="text-3xl font-bold mb-4 text-[#4b2e16]">
                {product.name}
              </h2>

              <p className="text-gray-700 mb-6 leading-relaxed text-[14px]">
                {product.description || 'Описание временно недоступно.'}
              </p>

              <p className="font-semibold text-lg">Стоимость:</p>
              <p className="text-[#860120] font-bold text-2xl mb-6">
                {product.price.toLocaleString('ru-RU')} ₸ / шт
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                disabled
                className="bg-gray-200 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
              >
                Доступен на самовывоз
              </button>

              {/* 🔥 Купить сразу → добавить в корзину + тост + закрыть */}
              <button
                onClick={() => {
                  addToCart(product);
                  toast.success(`Товар "${product.name}" добавлен в корзину!`);
                  onClose();
                }}
                className="bg-[#860120] hover:bg-[#a4022a] text-white font-semibold py-3 px-6 rounded-lg"
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
