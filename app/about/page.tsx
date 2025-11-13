import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fff9f5] text-[#4b2e16] py-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* 🌸 Вступление */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#860120] mb-6">
              Baked by Saya — это домашняя пекарня, где каждый десерт создаётся с любовью
            </h1>
            <p className="text-lg leading-relaxed">
              Мы готовим только из натуральных ингредиентов, без усилителей вкуса и искусственных добавок.  
              Наши десерты — это уют, тепло и вкус детства, которые мы хотим подарить каждому гостю.
            </p>
          </div>
          <div className="flex-1">
            <Image
              src="/bakery/bakery-interior.jpg"
              alt="Наша пекарня"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* 💎 Ценности */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-[#860120] mb-2">Натуральные ингредиенты</h3>
            <p>Используем только свежие, качественные продукты — без заменителей и ароматизаторов.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-[#860120] mb-2">Собственное производство</h3>
            <p>Всё готовим на нашей кухне — вручную, с вниманием к каждой детали и рецептуре.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-[#860120] mb-2">Качество и забота</h3>
            <p>Мы вкладываем душу в каждое изделие, чтобы вы чувствовали заботу и уют в каждом кусочке.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-[#860120] mb-2">Доступность и простота</h3>
            <p>Наши десерты созданы, чтобы радовать — вкусно, просто и доступно каждому.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-[#860120] mb-2">Уют и атмосфера</h3>
            <p>Каждая коробочка — маленький подарок, наполненный теплом, ароматом и нежностью.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-[#860120] mb-2">Дарим радость</h3>
            <p>Наши сладости делают праздники ярче, а повседневность — слаще и теплее.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
