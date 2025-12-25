"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { CatalogLoader } from "@/components/ui/CatalogLoader";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [p, setP] = useState<any>(null);
  const [original, setOriginal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("allproducts")
      .select("*")
      .eq("id", Number(id))
      .single();

    setP(data);
    setOriginal(data);
    setLoading(false);
  }

  function getChanges() {
    if (!original || !p) return [];

    const changes: string[] = [];

    if (original.name !== p.name)
      changes.push(`Название: "${original.name}" → "${p.name}"`);

    if (original.description !== p.description)
      changes.push(`Описание изменено`);

    if (original.price !== p.price)
      changes.push(`Цена: ${original.price} ₸ → ${p.price} ₸`);

    if (original.discount_percent !== p.discount_percent)
      changes.push(
        `Скидка: ${original.discount_percent}% → ${p.discount_percent}%`
      );

    if (original.status !== p.status)
      changes.push(`Статус: ${original.status} → ${p.status}`);

    if (original.is_active !== p.is_active)
      changes.push(
        `Видимость: ${
          original.is_active ? "вкл" : "выкл"
        } → ${p.is_active ? "вкл" : "выкл"}`
      );

    return changes;
  }

  async function save() {
    const final_price =
      p.discount_percent > 0
        ? Math.round(p.price * (1 - p.discount_percent / 100))
        : p.price;

    await supabase
      .from("allproducts")
      .update({
        ...p,
        final_price,
      })
      .eq("id", Number(id));

    router.push("/admin/products");
  }

  if (loading) {
  return <CatalogLoader />;
}


  const changes = getChanges();

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Редактировать товар</h1>

      {/* Название */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Название товара
        </label>
        <input
          className="w-full border rounded-xl px-4 py-3"
          value={p.name}
          onChange={(e) => setP({ ...p, name: e.target.value })}
        />
      </div>

      {/* Описание */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Описание
        </label>
        <textarea
          className="w-full border rounded-xl px-4 py-3 min-h-[120px]"
          value={p.description || ""}
          onChange={(e) =>
            setP({ ...p, description: e.target.value })
          }
        />
      </div>

      {/* Цена */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Цена (₸)
        </label>
        <input
          type="number"
          className="w-full border rounded-xl px-4 py-3"
          value={p.price}
          onChange={(e) => setP({ ...p, price: +e.target.value })}
        />
      </div>

      {/* Скидка */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Скидка (%)
        </label>
        <input
          type="number"
          className="w-full border rounded-xl px-4 py-3"
          value={p.discount_percent}
          onChange={(e) =>
            setP({ ...p, discount_percent: +e.target.value })
          }
        />
      </div>

      {/* Статус */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Статус
        </label>
        <select
          className="w-full border rounded-xl px-4 py-3"
          value={p.status}
          onChange={(e) =>
            setP({ ...p, status: e.target.value })
          }
        >
          <option value="active">Активен</option>
          <option value="hidden">Скрыт</option>
          <option value="out_of_stock">Нет в наличии</option>
          <option value="archived">Архив</option>
        </select>
      </div>

      {/* Видимость */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={p.is_active}
          onChange={(e) =>
            setP({ ...p, is_active: e.target.checked })
          }
        />
        Показывать на сайте
      </label>

      {/* Изменения */}
      {changes.length > 0 && (
        <div className="border border-dashed rounded-xl p-4 bg-[#FFFAF9]">
          <p className="font-medium mb-2">Изменения:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {changes.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Сохранить */}
      <button
        onClick={save}
        className="bg-[#860120] text-white px-8 py-3 rounded-xl"
      >
        Сохранить
      </button>
    </div>
  );
}
