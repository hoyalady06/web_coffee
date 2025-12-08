"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { ProductCard } from "@/components/products/ProductCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Избранные товары</h1>

      {favorites.length === 0 ? (
        <p className="text-lg text-gray-600">У вас пока нет избранных товаров 💛</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
