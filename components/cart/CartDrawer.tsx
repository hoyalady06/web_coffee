'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, changeQty, removeFromCart } = useCart();
  const router = useRouter();
  if (!open) return null;

  // 👉 Итоговая сумма
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />

      <div className="w-full max-w-md bg-white h-full shadow-xl z-50 flex flex-col">
        
        {/* Шапка */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-[#4b2e16]">Корзина</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* 👇 Пустая корзина */}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c2c2c2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.6-8.39H6" />
              </svg>

              <p className="text-lg text-[#999]">Корзина пустая</p>
            </div>
          )}

          {/* 👇 Корзина с товарами */}
          {cart.length > 0 && (
            <div className="flex flex-col gap-5">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  
                  {/* Фото + инфо */}
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />

                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.price} ₸</p>

                      {/* Количество */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => changeQty(item.id, item.qty - 1)}
                          className="w-6 h-6 border rounded flex items-center justify-center"
                        >
                          –
                        </button>

                        <span className="font-semibold">{item.qty}</span>

                        <button
                          onClick={() => changeQty(item.id, item.qty + 1)}
                          className="w-6 h-6 border rounded flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Цена + удалить */}
                  <div className="flex flex-col items-end">
                    <p className="font-semibold">{item.qty * item.price} ₸</p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div className="border-t px-5 py-4">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Итого:</span>
              <span>{total} ₸</span>
            </div>

<button
  onClick={() => {
    onClose();          // или setIsOpen(false);
    router.push("/checkout");
  }}
  className="w-full bg-[#860120] hover:bg-[#a4022a] text-white py-3 rounded-xl text-lg"
>
  Оформить заказ
</button>


          </div>
        )}
      </div>
    </div>
  );
}
