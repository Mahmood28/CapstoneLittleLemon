// Enhanced mock menu data for Little Lemon restaurant
export const mockMenuItems = [
  // Starters
  {
    id: 1,
    name: "Greek Salad",
    description: "Fresh mixed greens, tomatoes, olives, feta cheese, and our signature lemon herb dressing",
    price: "12.99",
    image: "greekSalad.jpg",
    category: "starters"
  },
  {
    id: 2,
    name: "Bruschetta",
    description: "Toasted artisan bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil",
    price: "9.99",
    image: "bruschetta.jpg", 
    category: "starters"
  },
  {
    id: 3,
    name: "Hummus Platter",
    description: "Creamy homemade hummus served with warm pita bread, olives, and fresh vegetables",
    price: "11.99",
    image: "hummus.jpg",
    category: "starters"
  },

  // Mains
  {
    id: 4,
    name: "Grilled Branzino",
    description: "Mediterranean sea bass grilled to perfection with lemon, herbs, and roasted vegetables",
    price: "28.99",
    image: "grilledFish.jpg",
    category: "mains"
  },
  {
    id: 5,
    name: "Lemon Herb Chicken",
    description: "Free-range chicken breast marinated in lemon, garlic, and Mediterranean herbs",
    price: "24.99",
    image: "lemonChicken.jpg",
    category: "mains"
  },
  {
    id: 6,
    name: "Pasta Primavera",
    description: "Fresh seasonal vegetables tossed with homemade pasta in a light herb and olive oil sauce",
    price: "19.99",
    image: "pasta.jpg",
    category: "mains"
  },
  {
    id: 7,
    name: "Lamb Moussaka",
    description: "Traditional Greek layered dish with seasoned lamb, eggplant, and béchamel sauce",
    price: "26.99",
    image: "moussaka.jpg",
    category: "mains"
  },

  // Desserts
  {
    id: 8,
    name: "Baklava",
    description: "Flaky phyllo pastry layered with honey, nuts, and aromatic spices",
    price: "8.99",
    image: "baklava.jpg",
    category: "desserts"
  },
  {
    id: 9,
    name: "Lemon Panna Cotta",
    description: "Silky smooth Italian dessert infused with fresh lemon and served with berry compote",
    price: "9.99",
    image: "pannacotta.jpg",
    category: "desserts"
  },
  {
    id: 10,
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers, mascarpone, and cocoa",
    price: "10.99",
    image: "tiramisu.jpg",
    category: "desserts"
  },

  // Drinks
  {
    id: 11,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and a hint of mint",
    price: "4.99",
    image: "lemonade.jpg",
    category: "drinks"
  },
  {
    id: 12,
    name: "Greek Coffee",
    description: "Traditional Greek coffee served with a small sweet treat",
    price: "3.99",
    image: "greekCoffee.jpg",
    category: "drinks"
  },
  {
    id: 13,
    name: "Mediterranean Sangria",
    description: "Red wine sangria with fresh fruits and Mediterranean herbs",
    price: "8.99",
    image: "sangria.jpg",
    category: "drinks"
  },

  // Sides
  {
    id: 14,
    name: "Roasted Vegetables",
    description: "Seasonal vegetables roasted with olive oil, herbs, and sea salt",
    price: "7.99",
    image: "roastedVeggies.jpg",
    category: "sides"
  },
  {
    id: 15,
    name: "Garlic Bread",
    description: "Warm artisan bread with roasted garlic butter and fresh herbs",
    price: "5.99",
    image: "garlicBread.jpg",
    category: "sides"
  },
  {
    id: 16,
    name: "Mediterranean Rice",
    description: "Aromatic rice pilaf with herbs, pine nuts, and dried fruits",
    price: "6.99",
    image: "rice.jpg",
    category: "sides"
  },

  // Non-alcoholic
  {
    id: 17,
    name: "Sparkling Water",
    description: "Premium sparkling water with lemon or lime",
    price: "2.99",
    image: "sparklingWater.jpg",
    category: "nonalc"
  },
  {
    id: 18,
    name: "Fresh Fruit Smoothie",
    description: "Blend of seasonal fruits with Greek yogurt and honey",
    price: "6.99",
    image: "smoothie.jpg",
    category: "nonalc"
  },
  {
    id: 19,
    name: "Herbal tea",
    description: "Selection of premium herbal teas including chamomile and mountain tea",
    price: "3.99",
    image: "herbalTea.jpg",
    category: "nonalc"
  }
];

export const getCategoryDisplayName = (category) => {
  const categoryNames = {
    starters: 'Starters',
    mains: 'Main Courses',
    desserts: 'Desserts',
    drinks: 'Beverages',
    sides: 'Sides',
    nonalc: 'Non-Alcoholic'
  };
  return categoryNames[category] || category;
};