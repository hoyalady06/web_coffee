import Image from "next/image";

export default function OrderCard({ order }: { order: any }) {
  const items = order.items || [];
  const itemCount = items.length;

  const previewItems = items.slice(0, 5);
  const extraCount = itemCount > 5 ? itemCount - 5 : 0;

  const orderNumber =
    order.order_number || `#${order.id.slice(0, 6).toUpperCase()}`;

  return (
    <a
      href={`/profile/orders/${order.id}`}
      className="block relative border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
    >
      {/* 🟦 Новый красивый статус — справа сверху */}
      <div
        className={`
          absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-semibold
          ${
            order.status === "processing"
              ? "bg-blue-100 text-blue-700"
              : order.status === "preparing"
              ? "bg-yellow-100 text-yellow-700"
              : order.status === "delivering"
              ? "bg-purple-100 text-purple-700"
              : "bg-green-100 text-green-700"
          }
        `}
      >
        {order.status === "processing" && "В обработке"}
        {order.status === "preparing" && "Готовится"}
        {order.status === "delivering" && "В пути"}
        {order.status === "delivered" && "Доставлен"}
      </div>

      <div className="flex justify-between items-center gap-6">
        {/* Левый текстовый блок */}
        <div className="flex-1">
          <p className="text-[15px] text-gray-600">{itemCount} товара(ов)</p>

          <p className="text-[17px] text-[#4b2e16] font-semibold mt-1">
            Сумма заказа:{" "}
            <span className="font-bold">
              {order.total.toLocaleString("ru-RU")} ₸
            </span>
          </p>

          <p className="mt-3 text-[15px] text-gray-600">Время заказа:</p>
          <p className="text-[16px] font-medium">
            {new Date(order.created_at).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>

          <p className="mt-3 text-[15px] text-gray-600">Номер заказа:</p>
          <p className="text-[16px] font-medium">{orderNumber}</p>
        </div>

        {/* Правые картинки */}
        <div className="flex items-center gap-2 max-w-[320px] overflow-hidden">
          {previewItems.map((item: any, idx: number) => (
            <Image
              key={idx}
              src={item.image}
              alt={item.name || "Фото товара"}
              width={55}
              height={55}
              className="rounded-lg border object-cover"
            />
          ))}

          {extraCount > 0 && (
            <div className="w-[55px] h-[55px] flex items-center justify-center rounded-lg border bg-gray-50 text-sm font-medium text-gray-600">
              +{extraCount}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-[#860120] font-medium text-sm">
        ➝ Подробнее о заказе
      </p>
    </a>
  );
}
