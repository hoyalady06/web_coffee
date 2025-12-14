"use client";

import { Slider } from "@/components/shared/slider/Slider";
import Image from "next/image";
import Link from "next/link";
import RecommendedProducts from "@/components/products/RecommendedProducts";

export default function HomePage() {
  return (
    <div className="pb-20">

      {/* HERO BLOCK */}
      <div className="w-full bg-[#FFFAF9] py-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-[#860120] mb-4">
              Свежая выпечка каждый день
            </h1>
            <p className="text-[#4b2e16] text-lg mb-6">
              Кондитерские изделия ручной работы с доставкой по городу.
            </p>

            <Link
              href="/category/cakes"
              className="bg-[#860120] text-white px-6 py-3 rounded-xl text-lg"
            >
              Смотреть торты
            </Link>
          </div>

          <Image
            src="/sertificate/sertificat1.png"
            width={450}
            height={350}
            alt="Cake Banner"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* BENEFITS */}
      <div className="container mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl shadow bg-white">🚚 Бесплатная доставка от 10 000 ₸</div>
        <div className="p-6 rounded-xl shadow bg-white">🎂 Свежие ингредиенты</div>
        <div className="p-6 rounded-xl shadow bg-white">❤️ Любимые рецепты</div>
      </div>

      {/* SLIDER */}
      <div className="container mx-auto mt-16">
        <Slider />
      </div>

      {/* RECOMMENDED PRODUCTS */}
      <div className="container mx-auto px-6 mt-14 mb-20">
        <RecommendedProducts />
      </div>
    </div>
  );
}
