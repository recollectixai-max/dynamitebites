export const currency = '$'
export const money = (n) => `${currency}${n.toFixed(2)}`

export const u = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const photos = {
  bread: '1509440159596-0249088772ff',
  croissant: '1555507036-ab1f4038808a',
  chocCake: '1578985545062-69928b1d9587',
  layerCake: '1464349095431-e9a21285b5f3',
  donut: '1551024601-bec78aea704b',
  coffee: '1495474472287-4d71bcdd2085',
  iced: '1461023058943-07fcbe16d735',
  cupcake: '1486427944299-d1955d23e34d',
  kitchen: '1556910103-1c02745aae4d',
  latte: '1509042239860-f550ce710b93',
  tart: '1488477181946-6428a0291777',
  shop: '1517433670267-08bbd4be890f',
  manA: '1507003211169-0a1dd7228f2d',
  womanA: '1494790108377-be9c29b29330',
  manB: '1500648767791-00dcc994a43e',
  about1: './g1.JPG',
  about2: './g2.JPG',
  about3: './g6.JPG',
}

export const goodies = [
  { name: 'Strawberry Cloud Tart', note: 'Whipped cream, glazed berries', price: 7.5, img: photos.tart },
  { name: 'Cocoa Twist Ring', note: 'Dark chocolate glaze', price: 4.5, img: photos.donut },
  { name: 'Honey Oat Muffin', note: 'Warm, soft, golden', price: 4.0, img: photos.cupcake },
  { name: 'Butter Croissant', note: '27 flaky layers', price: 3.75, img: photos.croissant },
  { name: 'Midnight Fudge Slice', note: 'Rich, dense, glossy', price: 6.25, img: photos.chocCake },
]

export const drinks = [
  { name: 'Caramel Cold Brew', note: 'Slow-steeped, silky', price: 5.0, img: photos.iced },
  { name: 'Hazelnut Latte', note: 'Toasted and creamy', price: 5.5, img: photos.latte },
  { name: 'Strawberry Milk Pop', note: 'Pink, cold, fizzy', price: 6.5, img: photos.coffee },
  { name: 'Orange Blossom Fizz', note: 'Bright and refreshing', price: 4.5, img: photos.iced },
]

export const faqs = [
  {
    q: 'How can I order from Dynamite Bites?',
    a: 'Explore our menu, choose your favourites and place your order through our available ordering channels. Whether you are craving a quick snack or a satisfying meal, we are ready to make your next food break delicious.',
  },
  {
    q: 'What kind of food do you serve?',
    a: 'Our menu brings together a delicious selection of Asian-inspired favourites, including crispy appetisers, chicken, seafood, noodles, rice dishes and refreshing beverages. There is plenty to discover for every kind of craving.',
  },
  {
    q: 'Do you offer home delivery?',
    a: 'Yes, delivery options may be available depending on your location in Dubai. Check our available ordering platforms, enter your delivery address and explore the options available in your area.',
  },
  {
    q: 'Can I place an order for a group?',
    a: 'Planning a meal with friends, family or colleagues? Get in touch with our team to discuss your requirements and explore the menu options available for your group.',
  },
  {
    q: 'Where can I find your menu and opening hours?',
    a: 'You can explore our latest menu and restaurant updates through our website and Instagram page. For the most accurate opening hours and availability, please check our latest updates before visiting.',
  },
];
