"use client";

import Image from "next/image";

export default function CertificatesPage() {
  return (
    <div className="container mx-auto px-6 py-12">

      {/* Заголовок */}
      <h1 className="text-4xl font-bold mb-10">
        Правила пользования сертификатом
      </h1>

      {/* Страница */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Текст */}
        <div className="text-lg leading-relaxed space-y-4">
          <p>1. Подарочный сертификат позволяет приобрести товары в любой торговой точке «Baked by Saya».</p>
          <p>2. Сертификат можно использовать только один раз, на всю сумму номинала.</p>
          <p>3. Если стоимость товара превышает сумму сертификата, разницу можно доплатить. Если ниже — остаток не возвращается.</p>
          <p>4. Сертификат не подлежит обмену на деньги и восстановлению при утере.</p>
          <p>5. Срок действия сертификата — 90 дней.</p>
        </div>

        {/* Картинки сертификатов */}
        <div className="flex flex-col gap-6 items-center">
          <Image
            src="/sertificate/sertificat10k.png"
            alt="Подарочный сертификат 10000 тг"
            width={350}
            height={300}
            className="rounded-lg shadow-lg"
          />

          <Image
            src="/sertificate/sertificate5k.png"
            alt="Подарочный сертификат 5000 тг"
            width={350}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* FAQ */}
      <h2 className="text-3xl font-bold mt-16 mb-6">FAQ</h2>

      <div className="space-y-6 text-lg">
        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer font-semibold">
            Где можно использовать сертификат?
          </summary>
          <p className="mt-2 text-gray-700">
            Он действует во всех филиалах Baked by Saya.
          </p>
        </details>

        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer font-semibold">
            Можно ли вернуть деньги?
          </summary>
          <p className="mt-2 text-gray-700">
            Нет, сертификат невозвратный.
          </p>
        </details>

        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer font-semibold">
            Можно ли использовать частично?
          </summary>
          <p className="mt-2 text-gray-700">
            Нет, сертификат используется только один раз.
          </p>
        </details>
      </div>

    </div>
  );
}
