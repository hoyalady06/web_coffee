"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/products/ProductCard";

export default function CertificatesPage() {
  const [activeTab, setActiveTab] = useState<"cards" | "about">("cards");

  return (
    <div className="w-full pt-0">

      {/* 🔹 Навигация вкладок */}
      <div className="w-full bg-[#860120] text-white pt-5">
        <div className="container mx-auto px-6 h-14 flex items-center justify-center gap-14 text-lg font-semibold">

          {/* TAB: Пластиковая карта */}
          <button
            onClick={() => setActiveTab("cards")}
            className={`relative pb-1 transition ${
              activeTab === "cards" ? "opacity-100" : "opacity-60"
            }`}
          >
            Пластиковая карта
            {activeTab === "cards" && (
              <span className="absolute left-0 right-0 -bottom-[2px] h-[2px] bg-white"></span>
            )}
          </button>

          {/* TAB: О карте */}
          <button
            onClick={() => setActiveTab("about")}
            className={`relative pb-1 transition ${
              activeTab === "about" ? "opacity-100" : "opacity-60"
            }`}
          >
            О карте
            {activeTab === "about" && (
              <span className="absolute left-0 right-0 -bottom-[2px] h-[2px] bg-white"></span>
            )}
          </button>

        </div>
      </div>

      {/* ================================
          TAB 1 — ПЛАСТИКОВАЯ КАРТА
         ================================ */}
      {activeTab === "cards" && (
        <>
          {/* Верхний баннер */}
          <div className="w-full bg-white">
            <div className="relative w-full h-[260px] md:h-[340px] lg:h-[300px]">

              <Image
                src="/sertificate/top-banner-card1.png"
                alt="Сертификат"
                fill
                className="object-cover object-left"
              />

              <div className="absolute top-10 right-6 md:right-12">
                <h1 className="text-[#860120] text-3xl md:text-5xl font-black text-right">
                  пластиковые<br />подарочные карты
                </h1>
              </div>

            </div>
          </div>

          {/* Секция 1 */}
          <div className="container mx-auto pt-10 grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Карточка 1 */}
            <div className="md:col-span-2 lg:col-span-3">
              <ProductCard
                product={{
                  id: 501,
                  name: "Сертификат 10000 ₸",
                  price: 10000,
                  image: "/sertificate/card10000-red.png",
                  category: "hidden",
                  description: "",
                }}
              />
            </div>

            {/* Карточка 2 */}
            <div className="md:col-span-2 lg:col-span-3">
              <ProductCard
                product={{
                  id: 505,
                  name: "Сертификат 5000 ₸",
                  price: 5000,
                  image: "/sertificate/card5000-pink.png",
                  category: "hidden",
                  description: "",
                }}
              />
            </div>

            {/* Большой баннер */}
            <div className="md:col-span-8 lg:col-span-6 rounded-xl overflow-hidden">
              <Image
                src="/sertificate/hand5000-1.png"
                alt="Сертификат 5000"
                width={900}
                height={200}
                className="object-cover"
              />
            </div>
          </div>

          {/* Секция 2 */}
          <div className="container mx-auto pt-10 pb-12 grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Большой слева */}
            <div className="md:col-span-6 rounded-xl overflow-hidden">
              <Image
                src="/sertificate/hand10000-1.png"
                alt="Сертификат 10000"
                width={900}
                height={700}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Карточка 3 */}
            <div className="md:col-span-3">
              <ProductCard
                product={{
                  id: 503,
                  name: "Сертификат 5000 ₸",
                  price: 5000,
                  image: "/sertificate/card5000-red.png",
                  category: "hidden",
                  description: "",
                }}
              />
            </div>

            {/* Карточка 4 */}
            <div className="md:col-span-3">
              <ProductCard
                product={{
                  id: 504,
                  name: "Сертификат 10000 ₸",
                  price: 10000,
                  image: "/sertificate/card10000-light.png",
                  category: "hidden",
                  description: "",
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* ================================
          TAB 2 — О КАРТЕ
         ================================ */}
      {activeTab === "about" && (
  <div className="w-full">

    {/* ============================ */}
    {/*  ЭКРАН 1 — КРУГ + АНИМАЦИЯ  */}
    {/* ============================ */}

    <div className="relative w-full flex flex-col items-center justify-center py-10 overflow-hidden">

      {/* КРУГ + ТЕКСТ ПО КРУГУ */}
      <div className="relative w-[700px] h-[700px] flex items-center justify-center">

        {/* Текст по кругу */}
        <div
          className="absolute w-full h-full flex items-center justify-center"
          style={{ animation: "rotate 18s linear infinite" }}
        >
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <defs>
              <path
                id="circlePath"
                d="M 150, 150 m -120, 0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0"
              />
            </defs>

            <text fontSize="18" fill="#000" fontWeight="600">
              <textPath href="#circlePath">
                GIFT CARD • GIFT CARD • GIFT CARD • GIFT CARD •
              </textPath>
            </text>
          </svg>
        </div>

        {/* Серый круг */}
        <div className="absolute w-[500px] h-[500px] bg-[#FFFAF9] rounded-full shadow-xl"></div>

        {/* Картинка */}
        <div className="absolute rotate-[-12deg]">
          <Image
            src="/sertificate/sertificat1.png"
            width={450}
            height={300}
            alt="card"
            className="rounded-2xl"
          />
        </div>
      </div>

      {/* Заголовок */}
      <h1 className="text-[80px] leading-[70px] font-black text-[#860120] text-center -mt-20">
        лучшее<br />решение<br />для подарка
      </h1>

      {/* Стрелка */}
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black text-white mt-10 text-2xl animate-bounce">
        ↓
      </div>

    </div>


    {/* ========================================= */}
    {/*   ЭКРАН 2 — НИЖНИЕ БЛОКИ, КОТОРЫЕ СКРОЛЛЯТСЯ */}
    {/* ========================================= */}

    {/* FIXED LEFT — SCROLL RIGHT SECTION */}
    <div className="w-full bg-white py-20">

      <div className="container mx-auto flex flex-col lg:flex-row gap-10">

        {/* ЛЕВАЯ ФИКС ЧАСТЬ */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="sticky top-24">
            <Image
              src="/sertificate/sertificat1.png"
              width={450}
              height={300}
              alt="card"
              className="rounded-2xl shadow-xl"
            />
          </div>
        </div>

        {/* ПРАВАЯ СКРОЛЛИРУЕМАЯ ЧАСТЬ */}
{/* ПРАВАЯ СКРОЛЛИРУЕМАЯ ЧАСТЬ */}
<div className="lg:w-1/2 h-[80vh] overflow-y-auto pr-6 space-y-24 text-[#4b2e16]">

  {/* 1. Пластиковая карта */}
  <section>
    <h2 className="text-4xl font-black text-[#860120] mb-4">
      пластиковая карта Baked by Saya
    </h2>
    <p className="text-lg leading-relaxed">
      Подарочная карта Baked by Saya — это самый простой способ подарить
      тёплые эмоции, уютные моменты и любимые десерты. 
      Просто добавьте карту в корзину, оформите заказ —
      и мы доставим её вместе с вашими сладостями или любым другим товаром.

      <br /><br />
      Если вы предпочитаете получать подарки офлайн, пластиковую карту
      можно приобрести в студии Baked by Saya. Карта оформлена в нежной
      фирменной стилистике и идеально подходит для тех, кто любит вкусные
      и атмосферные подарки.
    </p>


  </section>


  {/* 2. Как работает карта */}
  <section>
    <h2 className="text-4xl font-black text-[#860120] mb-4">
      как работает карта
    </h2>
    <p className="text-lg leading-relaxed">
      Подарочная карта Baked by Saya действует как в онлайн-магазине,
      так и при самовывозе. Достаточно авторизоваться на сайте, 
      выбрать любимые десерты — и при оформлении заказа указать номер карты.

      <br /><br />
      Карта может использоваться частично: если сумма заказа меньше,
      чем номинал, остаток сохранится на балансе. Вы можете использовать
      карту сколько угодно раз — пока на ней есть средства.

      <br /><br />
      Срок действия карты — <span className="font-semibold">3 года</span> с момента покупки.
    </p>
  </section>


  {/* 3. Как узнать баланс */}
  <section>
    <h2 className="text-4xl font-black text-[#860120] mb-4">
      как узнать баланс карты
    </h2>
    <p className="text-lg leading-relaxed">
      На обратной стороне карты расположен QR-код. Отсканируйте его —
      и вы попадёте на страницу, где всегда доступен текущий баланс,
      история пополнений и рекомендации, как использовать карту максимально удобно.

      <br /><br />
      Если у вас нет возможности отсканировать QR-код, просто напишите
      в чат поддержки Baked by Saya — мы быстро подскажем актуальную сумму.
    </p>
  </section>


  {/* 4. Доставка карты */}
  <section>
    <h2 className="text-4xl font-black text-[#860120] mb-4">
      доставка карты
    </h2>
    <p className="text-lg leading-relaxed">
      Мы бережно упаковываем каждую подарочную карту, чтобы она смотрелась
      достойно и празднично. Доступны два варианта доставки:
      <br /><br />
      • курьерская доставка по вашему адресу;<br />
      • бесплатный самовывоз из студии Baked by Saya.
      <br /><br />
      Карта размещается в красивом фирменном конверте, который делает подарок
      ещё более стильным и персональным.
    </p>
  </section>


  {/* 5. Использование онлайн */}
  <section>
    <h2 className="text-4xl font-black text-[#860120] mb-4">
      как использовать карту в интернет-магазине
    </h2>
    <p className="text-lg leading-relaxed">
      1. Авторизуйтесь на сайте или в мобильной версии Baked by Saya.<br />
      2. Соберите любимые десерты в корзину и перейдите к оформлению заказа.<br />
      3. Выберите способ оплаты «Подарочная карта».<br />
      4. Введите номер карты и CVC-код.<br />
      5. Укажите сумму, которую хотите списать — всю или частично.

      <br /><br />
      Если вы не использовали карту полностью, остаток автоматически
      сохранится и будет доступен при следующем заказе.
    </p>
  </section>


  {/* 6. Использование в магазине */}
  <section>
    <h2 className="text-4xl font-black text-[#860120] mb-4">
      как использовать карту в магазине
    </h2>
    <p className="text-lg leading-relaxed">
      При посещении студии Baked by Saya передайте карту администратору
      и скажите, какую сумму хотите использовать.

      <br /><br />
      Все средства, доступные на карте, хранятся в тенге. 
      Карта может быть использована только в Казахстане.
      Подарочные карты не подлежат возврату или обмену на наличные.
    </p>
  </section>

</div>
</div>
</div>
</div>
)}




    </div>
  );
}
