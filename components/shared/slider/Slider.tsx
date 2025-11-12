'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

export function Slider() {
  return (
    <section className="w-full py-6">
      {/* Контейнер с отступами по бокам */}
      <div className="container mx-auto px-6 md:px-16 lg:px-10">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          loop
          className="rounded-xl overflow-hidden shadow-sm"
        >
          <SwiperSlide>
            <Image
              src="/banner1.png"
              alt="Banner 1"
              width={1920}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/banner2.png"
              alt="Banner 2"
              width={1920}
              height={600}
              className="w-full h-auto object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/banner3.png"
              alt="Banner 3"
              width={1920}
              height={600}
              className="w-full h-auto object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
