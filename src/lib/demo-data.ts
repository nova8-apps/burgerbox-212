// Demo data for the burger ordering app

export type Topping = {
  id: string;
  name: string;
  price: number;
  icon: string;
};

export type Burger = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  calories: number;
  prepTime: string;
  featured: boolean;
  toppings: Topping[];
};

export type CartItem = {
  id: string;
  burger: Burger;
  quantity: number;
  selectedToppings: Topping[];
  totalPrice: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: "Delivered" | "Preparing" | "On the Way" | "Cancelled";
  date: string;
  orderNumber: string;
};

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "classic", label: "Classic" },
  { id: "spicy", label: "Spicy" },
  { id: "vegan", label: "Vegan" },
  { id: "combo", label: "Combo" },
  { id: "limited", label: "Limited" },
];

export const ALL_TOPPINGS: Topping[] = [
  { id: "t1", name: "Extra Cheese", price: 1.0, icon: "🧀" },
  { id: "t2", name: "Bacon", price: 1.5, icon: "🥓" },
  { id: "t3", name: "Jalapeños", price: 0.75, icon: "🌶️" },
  { id: "t4", name: "Avocado", price: 1.5, icon: "🥑" },
  { id: "t5", name: "Caramelized Onions", price: 0.75, icon: "🧅" },
  { id: "t6", name: "Fried Egg", price: 1.0, icon: "🍳" },
  { id: "t7", name: "Mushrooms", price: 0.75, icon: "🍄" },
  { id: "t8", name: "Pickles", price: 0.5, icon: "🥒" },
];

export const BURGERS: Burger[] = [
  {
    id: "b1",
    name: "The Classic Smash",
    description:
      "Double smashed patties with American cheese, lettuce, tomato, onion, pickles, and our signature sauce on a toasted brioche bun.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    category: "classic",
    rating: 4.8,
    reviewCount: 342,
    calories: 680,
    prepTime: "8-10 min",
    featured: true,
    toppings: [ALL_TOPPINGS[0], ALL_TOPPINGS[1], ALL_TOPPINGS[4], ALL_TOPPINGS[7]],
  },
  {
    id: "b2",
    name: "Inferno Blaze",
    description:
      "Ghost pepper-infused patty with pepper jack, jalapeños, habanero salsa, and sriracha mayo. Not for the faint-hearted.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600",
    category: "spicy",
    rating: 4.6,
    reviewCount: 218,
    calories: 720,
    prepTime: "10-12 min",
    featured: true,
    toppings: [ALL_TOPPINGS[2], ALL_TOPPINGS[0], ALL_TOPPINGS[5], ALL_TOPPINGS[4]],
  },
  {
    id: "b3",
    name: "Truffle Royale",
    description:
      "Wagyu beef patty with truffle aioli, gruyère cheese, arugula, and caramelized onions on a pretzel bun.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600",
    category: "classic",
    rating: 4.9,
    reviewCount: 156,
    calories: 780,
    prepTime: "12-15 min",
    featured: true,
    toppings: [ALL_TOPPINGS[0], ALL_TOPPINGS[4], ALL_TOPPINGS[6], ALL_TOPPINGS[3]],
  },
  {
    id: "b4",
    name: "Beyond Green",
    description:
      "Plant-based patty with vegan cheddar, fresh avocado, sprouts, tomato, and chipotle veganaise on a whole wheat bun.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1520072959219-c595e6fdc652?w=600",
    category: "vegan",
    rating: 4.5,
    reviewCount: 189,
    calories: 520,
    prepTime: "8-10 min",
    featured: false,
    toppings: [ALL_TOPPINGS[3], ALL_TOPPINGS[6], ALL_TOPPINGS[7], ALL_TOPPINGS[4]],
  },
  {
    id: "b5",
    name: "BBQ Smokehouse",
    description:
      "Hickory-smoked patty with crispy bacon, cheddar, onion rings, coleslaw, and smoky BBQ sauce.",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600",
    category: "classic",
    rating: 4.7,
    reviewCount: 276,
    calories: 820,
    prepTime: "10-12 min",
    featured: true,
    toppings: [ALL_TOPPINGS[1], ALL_TOPPINGS[0], ALL_TOPPINGS[4], ALL_TOPPINGS[7]],
  },
  {
    id: "b6",
    name: "Sriracha Crunch",
    description:
      "Crispy fried chicken patty with sriracha glaze, Asian slaw, pickled cucumbers, and sesame mayo.",
    price: 13.49,
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600",
    category: "spicy",
    rating: 4.4,
    reviewCount: 164,
    calories: 690,
    prepTime: "10-12 min",
    featured: false,
    toppings: [ALL_TOPPINGS[2], ALL_TOPPINGS[5], ALL_TOPPINGS[7], ALL_TOPPINGS[3]],
  },
  {
    id: "b7",
    name: "The Mighty Combo",
    description:
      "Triple patty with three cheeses, double bacon, lettuce, tomato, and special combo sauce. Served with fries & drink.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=600",
    category: "combo",
    rating: 4.8,
    reviewCount: 98,
    calories: 1240,
    prepTime: "15-18 min",
    featured: false,
    toppings: [ALL_TOPPINGS[0], ALL_TOPPINGS[1], ALL_TOPPINGS[5], ALL_TOPPINGS[2]],
  },
  {
    id: "b8",
    name: "Maple Bourbon",
    description:
      "Limited edition: bourbon-glazed patty with maple bacon, brie, fig jam, and arugula on a charcoal bun.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600",
    category: "limited",
    rating: 4.9,
    reviewCount: 67,
    calories: 760,
    prepTime: "12-15 min",
    featured: false,
    toppings: [ALL_TOPPINGS[1], ALL_TOPPINGS[0], ALL_TOPPINGS[4], ALL_TOPPINGS[6]],
  },
  {
    id: "b9",
    name: "Mediterranean Zen",
    description:
      "Falafel patty with hummus, tzatziki, sun-dried tomatoes, feta, and mixed greens in a warm pita.",
    price: 12.49,
    image: "https://images.unsplash.com/photo-1609167830220-7164aa7bf836?w=600",
    category: "vegan",
    rating: 4.3,
    reviewCount: 145,
    calories: 480,
    prepTime: "8-10 min",
    featured: false,
    toppings: [ALL_TOPPINGS[3], ALL_TOPPINGS[4], ALL_TOPPINGS[6], ALL_TOPPINGS[7]],
  },
  {
    id: "b10",
    name: "Korean Fire",
    description:
      "Gochujang-marinated patty with kimchi, pickled daikon, crispy shallots, and spicy mayo on a rice bun.",
    price: 15.49,
    image: "https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=600",
    category: "spicy",
    rating: 4.7,
    reviewCount: 112,
    calories: 710,
    prepTime: "12-15 min",
    featured: false,
    toppings: [ALL_TOPPINGS[2], ALL_TOPPINGS[5], ALL_TOPPINGS[4], ALL_TOPPINGS[7]],
  },
];

export const DEMO_USER = {
  name: "Alex Morgan",
  email: "alex.morgan@email.com",
  phone: "+1 (555) 234-5678",
  address: "248 Willow Creek Dr, Austin, TX 78701",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
};

export const PAST_ORDERS: Order[] = [
  {
    id: "o1",
    items: [
      {
        id: "ci1",
        burger: BURGERS[0],
        quantity: 2,
        selectedToppings: [ALL_TOPPINGS[0], ALL_TOPPINGS[1]],
        totalPrice: 30.98,
      },
      {
        id: "ci2",
        burger: BURGERS[4],
        quantity: 1,
        selectedToppings: [ALL_TOPPINGS[1]],
        totalPrice: 17.49,
      },
    ],
    total: 48.47,
    status: "Delivered",
    date: "May 12, 2026",
    orderNumber: "#BG-4821",
  },
  {
    id: "o2",
    items: [
      {
        id: "ci3",
        burger: BURGERS[2],
        quantity: 1,
        selectedToppings: [ALL_TOPPINGS[3]],
        totalPrice: 20.49,
      },
    ],
    total: 20.49,
    status: "Delivered",
    date: "May 8, 2026",
    orderNumber: "#BG-4756",
  },
  {
    id: "o3",
    items: [
      {
        id: "ci4",
        burger: BURGERS[7],
        quantity: 1,
        selectedToppings: [ALL_TOPPINGS[0], ALL_TOPPINGS[4]],
        totalPrice: 21.74,
      },
      {
        id: "ci5",
        burger: BURGERS[1],
        quantity: 1,
        selectedToppings: [],
        totalPrice: 14.99,
      },
    ],
    total: 36.73,
    status: "On the Way",
    date: "May 15, 2026",
    orderNumber: "#BG-4903",
  },
  {
    id: "o4",
    items: [
      {
        id: "ci6",
        burger: BURGERS[3],
        quantity: 2,
        selectedToppings: [ALL_TOPPINGS[3]],
        totalPrice: 30.98,
      },
    ],
    total: 30.98,
    status: "Cancelled",
    date: "Apr 29, 2026",
    orderNumber: "#BG-4612",
  },
];
