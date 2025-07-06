import { MenuItem } from "../types/order";

export const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: "app-1",
    name: "Caesar Salad",
    price: 12.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Fresh romaine lettuce with parmesan and croutons",
    preparationTime: 8,
    image:
      "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["dairy", "gluten"],
    ingredients: [
      "romaine lettuce",
      "parmesan cheese",
      "croutons",
      "caesar dressing",
    ],
  },
  {
    id: "app-2",
    name: "Buffalo Wings",
    price: 14.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Crispy chicken wings with buffalo sauce",
    preparationTime: 15,
    image:
      "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["dairy"],
    ingredients: [
      "chicken wings",
      "buffalo sauce",
      "celery",
      "blue cheese dressing",
    ],
  },
  {
    id: "app-3",
    name: "Calamari Rings",
    price: 16.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Golden fried squid rings with marinara sauce",
    preparationTime: 12,
    image:
      "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["seafood", "gluten"],
    ingredients: ["squid", "flour", "marinara sauce", "lemon"],
  },

  // Main Courses
  {
    id: "main-1",
    name: "Grilled Salmon",
    price: 28.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Atlantic salmon with lemon herb butter",
    preparationTime: 20,
    image:
      "https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["fish"],
    ingredients: ["salmon fillet", "lemon", "herbs", "butter", "vegetables"],
  },
  {
    id: "main-2",
    name: "Ribeye Steak",
    price: 32.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "12oz ribeye with garlic mashed potatoes",
    preparationTime: 25,
    image:
      "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["dairy"],
    ingredients: ["ribeye steak", "garlic", "potatoes", "butter", "herbs"],
  },
  {
    id: "main-3",
    name: "Chicken Parmesan",
    price: 24.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Breaded chicken breast with marinara and mozzarella",
    preparationTime: 18,
    image:
      "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["dairy", "gluten"],
    ingredients: [
      "chicken breast",
      "breadcrumbs",
      "marinara sauce",
      "mozzarella",
      "pasta",
    ],
  },
  {
    id: "main-4",
    name: "Vegetable Pasta",
    price: 19.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Penne pasta with seasonal vegetables",
    preparationTime: 15,
    image:
      "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["gluten"],
    ingredients: [
      "penne pasta",
      "bell peppers",
      "zucchini",
      "tomatoes",
      "olive oil",
    ],
  },

  // Desserts
  {
    id: "dessert-1",
    name: "Chocolate Cake",
    price: 8.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Rich chocolate cake with vanilla ice cream",
    preparationTime: 5,
    image:
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["dairy", "gluten", "eggs"],
    ingredients: ["chocolate", "flour", "eggs", "vanilla ice cream"],
  },
  {
    id: "dessert-2",
    name: "Cheesecake",
    price: 9.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "New York style cheesecake with berry compote",
    preparationTime: 5,
    image:
      "https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["dairy", "gluten", "eggs"],
    ingredients: ["cream cheese", "graham crackers", "berries", "sugar"],
  },

  // Beverages
  {
    id: "bev-1",
    name: "House Wine",
    price: 8.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Red or white wine selection",
    preparationTime: 2,
    image:
      "https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["sulfites"],
    ingredients: ["grapes", "sulfites"],
  },
  {
    id: "bev-2",
    name: "Craft Beer",
    price: 6.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Local brewery selection",
    preparationTime: 2,
    image:
      "https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: ["gluten"],
    ingredients: ["hops", "barley", "yeast", "water"],
  },
  {
    id: "bev-3",
    name: "Soft Drinks",
    price: 3.99,
    category: {
      id: "appetizer",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      image:
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
      sortOrder: 1,
    },
    categoryId: "appetizer",
    description: "Coke, Sprite, Orange juice",
    preparationTime: 1,
    image:
      "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAvailable: true,
    allergens: [],
    ingredients: ["carbonated water", "natural flavors", "sugar"],
  },
];
