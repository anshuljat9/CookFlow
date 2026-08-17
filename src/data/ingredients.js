export const ingredientCategories = [
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { id: 'fruits', name: 'Fruits', icon: '🍎', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'grains', name: 'Grains & Pasta', icon: '🌾', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'spices', name: 'Spices & Herbs', icon: '🌿', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { id: 'proteins', name: 'Proteins', icon: '🥩', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  { id: 'sauces', name: 'Sauces & Condiments', icon: '🫙', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'other', name: 'Other', icon: '📦', color: 'bg-warm-100 text-charcoal-700 dark:bg-charcoal-800 dark:text-warm-300' },
];

export const ingredients = [
  // Vegetables
  { id: 'potato', name: 'Potato', category: 'vegetables', icon: '🥔' },
  { id: 'onion', name: 'Onion', category: 'vegetables', icon: '🧅' },
  { id: 'tomato', name: 'Tomato', category: 'vegetables', icon: '🍅' },
  { id: 'garlic', name: 'Garlic', category: 'vegetables', icon: '🧄' },
  { id: 'ginger', name: 'Ginger', category: 'vegetables', icon: '🫚' },
  { id: 'carrot', name: 'Carrot', category: 'vegetables', icon: '🥕' },
  { id: 'bell-pepper', name: 'Bell Pepper', category: 'vegetables', icon: '🫑' },
  { id: 'broccoli', name: 'Broccoli', category: 'vegetables', icon: '🥦' },
  { id: 'spinach', name: 'Spinach', category: 'vegetables', icon: '🥬' },
  { id: 'cauliflower', name: 'Cauliflower', category: 'vegetables', icon: '🥦' },
  { id: 'mushroom', name: 'Mushroom', category: 'vegetables', icon: '🍄' },
  { id: 'zucchini', name: 'Zucchini', category: 'vegetables', icon: '🥒' },
  { id: 'eggplant', name: 'Eggplant', category: 'vegetables', icon: '🍆' },
  { id: 'cucumber', name: 'Cucumber', category: 'vegetables', icon: '🥒' },
  { id: 'lettuce', name: 'Lettuce', category: 'vegetables', icon: '🥬' },

  // Fruits
  { id: 'lemon', name: 'Lemon', category: 'fruits', icon: '🍋' },
  { id: 'lime', name: 'Lime', category: 'fruits', icon: '🍈' },
  { id: 'apple', name: 'Apple', category: 'fruits', icon: '🍎' },
  { id: 'banana', name: 'Banana', category: 'fruits', icon: '🍌' },
  { id: 'avocado', name: 'Avocado', category: 'fruits', icon: '🥑' },
  { id: 'mango', name: 'Mango', category: 'fruits', icon: '🥭' },

  // Dairy & Eggs
  { id: 'milk', name: 'Milk', category: 'dairy', icon: '🥛' },
  { id: 'butter', name: 'Butter', category: 'dairy', icon: '🧈' },
  { id: 'cheese', name: 'Cheese', category: 'dairy', icon: '🧀' },
  { id: 'yogurt', name: 'Yogurt', category: 'dairy', icon: '🥣' },
  { id: 'cream', name: 'Heavy Cream', category: 'dairy', icon: '🥛' },
  { id: 'eggs', name: 'Eggs', category: 'dairy', icon: '🥚' },
  { id: 'paneer', name: 'Paneer', category: 'dairy', icon: '🧀' },

  // Grains & Pasta
  { id: 'rice', name: 'Rice', category: 'grains', icon: '🍚' },
  { id: 'pasta', name: 'Pasta', category: 'grains', icon: '🍝' },
  { id: 'noodles', name: 'Noodles', category: 'grains', icon: '🍜' },
  { id: 'bread', name: 'Bread', category: 'grains', icon: '🍞' },
  { id: 'flour', name: 'Flour', category: 'grains', icon: '🌾' },
  { id: 'oats', name: 'Oats', category: 'grains', icon: '🌾' },
  { id: 'quinoa', name: 'Quinoa', category: 'grains', icon: '🌾' },

  // Spices & Herbs
  { id: 'salt', name: 'Salt', category: 'spices', icon: '🧂' },
  { id: 'pepper', name: 'Black Pepper', category: 'spices', icon: '🌶️' },
  { id: 'cumin', name: 'Cumin', category: 'spices', icon: '🌱' },
  { id: 'coriander', name: 'Coriander', category: 'spices', icon: '🌿' },
  { id: 'turmeric', name: 'Turmeric', category: 'spices', icon: '🟡' },
  { id: 'chili-powder', name: 'Chili Powder', category: 'spices', icon: '🌶️' },
  { id: 'garam-masala', name: 'Garam Masala', category: 'spices', icon: '🌿' },
  { id: 'oregano', name: 'Oregano', category: 'spices', icon: '🌿' },
  { id: 'basil', name: 'Basil', category: 'spices', icon: '🌿' },
  { id: 'bay-leaf', name: 'Bay Leaf', category: 'spices', icon: '🍃' },
  { id: 'cinnamon', name: 'Cinnamon', category: 'spices', icon: '🌰' },

  // Proteins
  { id: 'chicken', name: 'Chicken', category: 'proteins', icon: '🍗' },
  { id: 'beef', name: 'Beef', category: 'proteins', icon: '🥩' },
  { id: 'fish', name: 'Fish', category: 'proteins', icon: '🐟' },
  { id: 'shrimp', name: 'Shrimp', category: 'proteins', icon: '🦐' },
  { id: 'tofu', name: 'Tofu', category: 'proteins', icon: '🧱' },
  { id: 'chickpeas', name: 'Chickpeas', category: 'proteins', icon: '🫘' },
  { id: 'lentils', name: 'Lentils', category: 'proteins', icon: '🫘' },

  // Sauces & Condiments
  { id: 'soy-sauce', name: 'Soy Sauce', category: 'sauces', icon: '🫙' },
  { id: 'olive-oil', name: 'Olive Oil', category: 'sauces', icon: '🫒' },
  { id: 'vinegar', name: 'Vinegar', category: 'sauces', icon: '🫙' },
  { id: 'tomato-sauce', name: 'Tomato Sauce', category: 'sauces', icon: '🫙' },
  { id: 'hot-sauce', name: 'Hot Sauce', category: 'sauces', icon: '🌶️' },
  { id: 'honey', name: 'Honey', category: 'sauces', icon: '🍯' },
  { id: 'mustard', name: 'Mustard', category: 'sauces', icon: '🫙' },

  // Other
  { id: 'sugar', name: 'Sugar', category: 'other', icon: '🍬' },
  { id: 'baking-powder', name: 'Baking Powder', category: 'other', icon: '📦' },
  { id: 'vanilla', name: 'Vanilla Extract', category: 'other', icon: '📦' },
];

export const getIngredientsByCategory = (categoryId) => {
  return ingredients.filter(ing => ing.category === categoryId);
};

export const searchIngredients = (query) => {
  const lowerQuery = query.toLowerCase();
  return ingredients.filter(ing =>
    ing.name.toLowerCase().includes(lowerQuery)
  );
};