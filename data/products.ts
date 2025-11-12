// /data/products.ts
export type Category = 'cakes' | 'pies' | 'bakery';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: Category;
  description?: string;
}

export const allProducts: Product[] = [
  { id: 1, name: '«Balhadisha» торт', price: 8000, image: '/cake/balhadisha.png', category: 'cakes' },
  { id: 2, name: 'Клубничный торт',     price: 7000, image: '/cake/strawberry.png', category: 'cakes' },
  { id: 3, name: '«Red Velvet» торт',   price: 8500, image: '/cake/redvelvet.png',  category: 'cakes' },
  { id: 4, name: 'Молочная девочка',    price: 8500, image: '/cake/moloshnaya.png',  category: 'cakes' },
  { id: 5, name: 'Медовый торт',        price: 6700, image: '/cake/honey.png',      category: 'cakes' },
  { id: 6, name: 'Тирамису',            price: 6500, image: '/cake/tiramisu.png',   category: 'cakes' },

  { id: 7, name: 'Яблочный пирог',      price: 6500, image: '/pies/apple-pie.png',   category: 'pies' },
  { id: 8, name: 'Черничный пирог',     price: 6700, image: '/pies/blueberry-pie.png', category: 'pies' },
  { id: 9, name: 'Вишнёвый пирог',      price: 6800, image: '/pies/cherry-pie.png',  category: 'pies' },
  { id:10, name: 'Лимонный пирог',      price: 7000, image: '/pies/lemon-pie.png',   category: 'pies' },

  { id:11, name: 'Булочка с корицей',   price: 1200, image: '/bakery/cinnamon-roll.png', category: 'bakery' },
  { id:12, name: 'Самса с курицей',     price: 1000, image: '/bakery/samsa.png', category: 'bakery' },
  { id:13, name: 'Шоколадты пончик',    price: 1300, image: '/bakery/donut.png', category: 'bakery' },
  { id:14, name: 'Бауырсаки',    price: 900,  image: '/bakery/bauysaq.png', category: 'bakery' },
];
