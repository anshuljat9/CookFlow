export const recipes = [
  {
    id: 1,
    title: "Butter Chicken",
    cuisine: "indian",
    category: "dinner",
    difficulty: "medium",
    cookingTime: 45,
    servings: 4,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop",
    description: "Creamy, rich, and perfectly spiced chicken in a velvety tomato-based sauce.",
    ingredients: [
      "500g chicken breast, cubed",
      "1 cup yogurt",
      "2 tbsp ginger-garlic paste",
      "1 tsp turmeric",
      "1 tsp red chili powder",
      "2 tbsp butter",
      "1 large onion, pureed",
      "2 cups tomato puree",
      "1 cup heavy cream",
      "1 tsp garam masala",
      "1 tsp kasuri methi",
      "Salt to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Marinate chicken with yogurt, ginger-garlic paste, turmeric, chili powder, and salt for 30 minutes.",
      "Grill or pan-fry chicken until slightly charred. Set aside.",
      "In a pan, melt butter and sauté onion puree until golden brown.",
      "Add tomato puree and cook until oil separates.",
      "Add cream, garam masala, and kasuri methi. Simmer for 5 minutes.",
      "Add cooked chicken and simmer for 10 minutes until flavors meld.",
      "Garnish with cilantro and serve with naan or rice."
    ],
    tags: ["popular", "non-vegetarian"],
    isFavorite: false
  },
  {
    id: 2,
    title: "Margherita Pizza",
    cuisine: "italian",
    category: "dinner",
    difficulty: "medium",
    cookingTime: 30,
    servings: 2,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop",
    description: "Classic Neapolitan pizza with fresh mozzarella, San Marzano tomatoes, and basil.",
    ingredients: [
      "250g pizza dough",
      "100g San Marzano tomato sauce",
      "150g fresh mozzarella",
      "Fresh basil leaves",
      "Extra virgin olive oil",
      "Salt"
    ],
    instructions: [
      "Preheat oven to 475°F (245°C) with pizza stone inside.",
      "Stretch dough on floured surface to 12-inch circle.",
      "Spread tomato sauce evenly, leaving 1-inch border.",
      "Tear mozzarella and distribute over sauce.",
      "Bake for 10-12 minutes until crust is golden and cheese bubbles.",
      "Top with fresh basil and drizzle olive oil."
    ],
    tags: ["popular", "vegetarian"],
    isFavorite: true
  },
  {
    id: 3,
    title: "Kung Pao Chicken",
    cuisine: "chinese",
    category: "dinner",
    difficulty: "medium",
    cookingTime: 25,
    servings: 3,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1598515028193-3bb5f721d3b2?w=800&auto=format&fit=crop",
    description: "Spicy Sichuan stir-fry with chicken, peanuts, and dried chilies.",
    ingredients: [
      "300g chicken thigh, diced",
      "1/2 cup roasted peanuts",
      "6 dried red chilies",
      "1 bell pepper, cubed",
      "1 onion, cubed",
      "3 tbsp soy sauce",
      "1 tbsp dark soy sauce",
      "1 tbsp Chinese black vinegar",
      "1 tbsp sugar",
      "1 tsp cornstarch",
      "2 tbsp oil",
      "2 tsp Sichuan peppercorns",
      "3 garlic cloves, minced",
      "1 tsp ginger, minced",
      "2 green onions, chopped"
    ],
    instructions: [
      "Marinate chicken with soy sauce, cornstarch, and 1 tbsp oil for 15 minutes.",
      "Mix sauce: soy sauces, vinegar, sugar, and 2 tbsp water.",
      "Toast Sichuan peppercorns, crush lightly.",
      "Stir-fry chicken until cooked through. Remove.",
      "Stir-fry chilies, peppercorns, garlic, ginger until fragrant.",
      "Add vegetables, stir-fry 2 minutes.",
      "Return chicken, add sauce, toss with peanuts and green onions."
    ],
    tags: ["spicy", "non-vegetarian"],
    isFavorite: false
  },
  {
    id: 4,
    title: "Chicken Tacos al Pastor",
    cuisine: "mexican",
    category: "dinner",
    difficulty: "easy",
    cookingTime: 35,
    servings: 4,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&auto=format&fit=crop",
    description: "Achiote-marinated chicken with pineapple, onion, and cilantro in corn tortillas.",
    ingredients: [
      "500g chicken thigh, thinly sliced",
      "3 tbsp achiote paste",
      "1/4 cup orange juice",
      "2 tbsp lime juice",
      "3 garlic cloves",
      "1 tsp cumin",
      "1 tsp oregano",
      "1 pineapple, sliced",
      "Corn tortillas",
      "1 onion, diced",
      "Cilantro, chopped",
      "Lime wedges",
      "Salsa verde"
    ],
    instructions: [
      "Blend achiote, orange juice, lime, garlic, cumin, oregano into paste.",
      "Marinate chicken for 2 hours or overnight.",
      "Grill chicken and pineapple until charred.",
      "Chop chicken, warm tortillas.",
      "Assemble: chicken, pineapple, onion, cilantro, salsa.",
      "Serve with lime wedges."
    ],
    tags: ["popular", "non-vegetarian"],
    isFavorite: true
  },
  {
    id: 5,
    title: "Korean Garlic Noodles",
    cuisine: "korean",
    category: "lunch",
    difficulty: "easy",
    cookingTime: 15,
    servings: 2,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1619995987388-3e0b3e8a4c4a?w=800&auto=format&fit=crop",
    description: "Buttery, garlicky, spicy noodles ready in 15 minutes.",
    ingredients: [
      "200g spaghetti or wheat noodles",
      "4 tbsp butter",
      "8 garlic cloves, minced",
      "2 tbsp soy sauce",
      "1 tbsp gochugaru (Korean chili flakes)",
      "1 tbsp honey",
      "1 tsp sesame oil",
      "Green onions, chopped",
      "Sesame seeds",
      "Optional: fried egg"
    ],
    instructions: [
      "Cook noodles al dente, reserve 1/2 cup pasta water.",
      "Melt butter in large pan over medium heat.",
      "Add garlic, cook until golden and fragrant (don't burn).",
      "Add soy sauce, gochugaru, honey, sesame oil.",
      "Toss in noodles with pasta water to create emulsion.",
      "Top with green onions, sesame seeds, and fried egg."
    ],
    tags: ["quick", "vegetarian"],
    isFavorite: true
  },
  {
    id: 6,
    title: "Classic Cheeseburger",
    cuisine: "american",
    category: "dinner",
    difficulty: "easy",
    cookingTime: 20,
    servings: 2,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
    description: "Juicy beef patty with melted cheese, crisp lettuce, and special sauce.",
    ingredients: [
      "300g ground beef (80/20)",
      "2 brioche buns",
      "2 slices cheddar cheese",
      "Lettuce leaves",
      "1 tomato, sliced",
      "1/2 onion, sliced",
      "Pickles",
      "2 tbsp mayonnaise",
      "1 tbsp ketchup",
      "1 tsp mustard",
      "Salt, pepper"
    ],
    instructions: [
      "Form beef into 2 patties, season generously with salt and pepper.",
      "Heat cast iron skillet over high heat.",
      "Cook patties 3-4 min per side, add cheese last minute.",
      "Toast buns in same pan.",
      "Mix mayo, ketchup, mustard for sauce.",
      "Assemble: bun, sauce, lettuce, patty, tomato, onion, pickles, bun."
    ],
    tags: ["popular", "non-vegetarian"],
    isFavorite: false
  },
  {
    id: 7,
    title: "Greek Salad",
    cuisine: "mediterranean",
    category: "lunch",
    difficulty: "easy",
    cookingTime: 10,
    servings: 4,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop",
    description: "Fresh cucumbers, tomatoes, olives, feta, and oregano with olive oil.",
    ingredients: [
      "2 cucumbers, chunked",
      "4 tomatoes, wedged",
      "1 red onion, sliced",
      "1 green pepper, sliced",
      "200g feta cheese, block",
      "Kalamata olives",
      "Extra virgin olive oil",
      "Red wine vinegar",
      "Dried oregano",
      "Salt, pepper"
    ],
    instructions: [
      "Combine cucumbers, tomatoes, onion, pepper in large bowl.",
      "Add olives.",
      "Place feta block on top.",
      "Drizzle generously with olive oil and vinegar.",
      "Sprinkle oregano, salt, pepper.",
      "Serve immediately with crusty bread."
    ],
    tags: ["healthy", "vegetarian", "quick"],
    isFavorite: false
  },
  {
    id: 8,
    title: "Salmon Teriyaki",
    cuisine: "japanese",
    category: "dinner",
    difficulty: "easy",
    cookingTime: 20,
    servings: 2,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop",
    description: "Glazed salmon with sweet-savory teriyaki sauce, served over rice.",
    ingredients: [
      "2 salmon fillets (150g each)",
      "3 tbsp soy sauce",
      "2 tbsp mirin",
      "2 tbsp sake",
      "1 tbsp sugar",
      "1 tsp ginger, grated",
      "1 garlic clove, minced",
      "1 tsp cornstarch + 1 tbsp water",
      "Sesame seeds",
      "Green onions",
      "Steamed rice"
    ],
    instructions: [
      "Mix soy sauce, mirin, sake, sugar, ginger, garlic.",
      "Pan-sear salmon skin-side down 4 minutes.",
      "Flip, add sauce, simmer until thickened.",
      "Add cornstarch slurry for extra gloss.",
      "Spoon glaze over salmon.",
      "Serve over rice with sesame seeds and green onions."
    ],
    tags: ["healthy", "non-vegetarian"],
    isFavorite: true
  },
  {
    id: 9,
    title: "Pad Thai",
    cuisine: "thai",
    category: "dinner",
    difficulty: "medium",
    cookingTime: 30,
    servings: 2,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop",
    description: "Classic stir-fried rice noodles with tamarind, shrimp, peanuts, and lime.",
    ingredients: [
      "200g rice noodles",
      "150g shrimp, peeled",
      "2 eggs",
      "1 cup bean sprouts",
      "3 tbsp fish sauce",
      "2 tbsp tamarind paste",
      "1 tbsp palm sugar",
      "1 tbsp chili powder",
      "3 garlic cloves",
      "1/2 cup chives, cut",
      "1/4 cup peanuts, crushed",
      "Lime wedges",
      "Oil"
    ],
    instructions: [
      "Soak noodles in warm water 20 minutes, drain.",
      "Mix fish sauce, tamarind, sugar, chili powder.",
      "Stir-fry shrimp until pink, remove.",
      "Scramble eggs in same pan.",
      "Add noodles, sauce, toss until coated.",
      "Add shrimp, bean sprouts, chives.",
      "Serve with peanuts and lime."
    ],
    tags: ["popular", "non-vegetarian"],
    isFavorite: false
  },
  {
    id: 10,
    title: "Chicken Alfredo",
    cuisine: "continental",
    category: "dinner",
    difficulty: "easy",
    cookingTime: 25,
    servings: 3,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop",
    description: "Creamy fettuccine with tender chicken in rich parmesan sauce.",
    ingredients: [
      "300g fettuccine",
      "2 chicken breasts, sliced",
      "2 cups heavy cream",
      "1 cup parmesan, grated",
      "4 tbsp butter",
      "3 garlic cloves, minced",
      "Salt, pepper",
      "Nutmeg pinch",
      "Parsley, chopped"
    ],
    instructions: [
      "Cook pasta al dente, reserve 1 cup water.",
      "Season chicken, pan-sear in 2 tbsp butter until golden. Remove.",
      "In same pan, melt 2 tbsp butter, sauté garlic.",
      "Add cream, simmer 3 minutes.",
      "Whisk in parmesan until smooth.",
      "Add chicken and pasta, toss with pasta water.",
      "Garnish with parsley."
    ],
    tags: ["popular", "non-vegetarian"],
    isFavorite: false
  },
  {
    id: 11,
    title: "Vegetable Biryani",
    cuisine: "indian",
    category: "dinner",
    difficulty: "hard",
    cookingTime: 60,
    servings: 4,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop",
    description: "Fragrant layered rice with mixed vegetables, saffron, and aromatic spices.",
    ingredients: [
      "2 cups basmati rice",
      "Mixed vegetables (carrot, peas, beans, potato)",
      "1 cup yogurt",
      "2 onions, fried golden",
      "2 tomatoes, chopped",
      "Ginger-garlic paste",
      "Biryani masala",
      "Saffron milk",
      "Mint, cilantro",
      "Ghee, oil",
      "Whole spices (bay leaf, cardamom, cloves, cinnamon)"
    ],
    instructions: [
      "Soak rice 30 minutes. Par-boil with whole spices until 70% done.",
      "Sauté vegetables with spices, yogurt, tomatoes.",
      "Layer: rice, vegetable mixture, fried onions, herbs, saffron milk.",
      "Repeat layers. Seal pot with dough or tight lid.",
      "Cook on dum (low heat) for 25 minutes.",
      "Rest 10 minutes, gently mix before serving."
    ],
    tags: ["vegetarian"],
    isFavorite: true
  },
  {
    id: 12,
    title: "Carbonara",
    cuisine: "italian",
    category: "dinner",
    difficulty: "medium",
    cookingTime: 20,
    servings: 2,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop",
    description: "Silky pasta with guanciale, egg, pecorino, and black pepper. No cream.",
    ingredients: [
      "200g spaghetti",
      "100g guanciale or pancetta",
      "3 egg yolks + 1 whole egg",
      "50g pecorino romano, grated",
      "Black pepper, freshly cracked",
      "Salt"
    ],
    instructions: [
      "Cook pasta in salted water.",
      "Crisp guanciale in cold pan, render fat.",
      "Whisk eggs, pecorino, generous pepper.",
      "Add 1/2 cup pasta water to guanciale, remove from heat.",
      "Add pasta, toss vigorously.",
      "Remove from heat completely, add egg mixture, toss rapidly.",
      "Add more pasta water if needed. Serve immediately."
    ],
    tags: ["popular", "non-vegetarian"],
    isFavorite: true
  },
  {
    id: 13,
    title: "Mapo Tofu",
    cuisine: "chinese",
    category: "dinner",
    difficulty: "medium",
    cookingTime: 20,
    servings: 3,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1585580750963-4d5f9d5a8c0a?w=800&auto=format&fit=crop",
    description: "Silken tofu in spicy, numbing Sichuan sauce with ground pork.",
    ingredients: [
      "400g silken tofu, cubed",
      "150g ground pork",
      "2 tbsp doubanjiang (fermented bean paste)",
      "1 tsp fermented black beans",
      "1 tbsp soy sauce",
      "1 tsp sugar",
      "1 cup chicken stock",
      "2 tsp cornstarch + 2 tbsp water",
      "Sichuan peppercorn powder",
      "Chili oil",
      "Green onions"
    ],
    instructions: [
      "Blanch tofu in salted water 1 minute, drain.",
      "Brown pork in oil, break into small pieces.",
      "Add doubanjiang, black beans, stir until red oil appears.",
      "Add stock, soy sauce, sugar, simmer.",
      "Gently add tofu, don't break.",
      "Thicken with cornstarch slurry.",
      "Finish with Sichuan pepper, chili oil, green onions."
    ],
    tags: ["spicy", "non-vegetarian"],
    isFavorite: false
  },
  {
    id: 14,
    title: "Fish Tacos",
    cuisine: "mexican",
    category: "lunch",
    difficulty: "easy",
    cookingTime: 25,
    servings: 3,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1559472091-2f25b6f65f7e?w=800&auto=format&fit=crop",
    description: "Crispy beer-battered fish with cabbage slaw and chipotle crema.",
    ingredients: [
      "300g white fish (cod/tilapia)",
      "1 cup flour",
      "1/2 cup cornstarch",
      "1 tsp baking powder",
      "1 cup cold beer",
      "Cabbage slaw mix",
      "1/2 cup mayo",
      "1 chipotle in adobo",
      "Lime juice",
      "Corn tortillas",
      "Oil for frying"
    ],
    instructions: [
      "Mix flour, cornstarch, baking powder, beer into batter.",
      "Dip fish, fry at 375°F until golden.",
      "Blend mayo, chipotle, lime for crema.",
      "Toss cabbage with lime, salt.",
      "Warm tortillas.",
      "Assemble: fish, slaw, crema, salsa."
    ],
    tags: ["non-vegetarian"],
    isFavorite: false
  },
  {
    id: 15,
    title: "Bibimbap",
    cuisine: "korean",
    category: "lunch",
    difficulty: "medium",
    cookingTime: 35,
    servings: 2,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1543363873-8e6cf8a3d3e7?w=800&auto=format&fit=crop",
    description: "Mixed rice bowl with vegetables, beef, egg, and gochujang sauce.",
    ingredients: [
      "2 cups cooked rice",
      "150g beef, marinated (soy, sugar, sesame, garlic)",
      "Spinach, bean sprouts, carrots, zucchini, mushrooms",
      "2 eggs",
      "Gochujang",
      "Sesame oil",
      "Sesame seeds",
      "Nori strips"
    ],
    instructions: [
      "Prepare each vegetable separately: blanch and season.",
      "Stir-fry marinated beef.",
      "Fry eggs sunny-side up.",
      "Place rice in bowls, arrange vegetables and beef.",
      "Top with egg, gochujang, sesame oil, seeds, nori.",
      "Mix everything before eating."
    ],
    tags: ["healthy", "non-vegetarian"],
    isFavorite: true
  },
  {
    id: 16,
    title: "Mac and Cheese",
    cuisine: "american",
    category: "dinner",
    difficulty: "easy",
    cookingTime: 30,
    servings: 4,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&auto=format&fit=crop",
    description: "Creamy baked macaroni with three-cheese sauce and crispy breadcrumb topping.",
    ingredients: [
      "300g elbow macaroni",
      "3 tbsp butter",
      "3 tbsp flour",
      "3 cups milk",
      "2 cups sharp cheddar",
      "1 cup gruyere",
      "1/2 cup parmesan",
      "1 tsp mustard powder",
      "Panko breadcrumbs",
      "Paprika"
    ],
    instructions: [
      "Cook pasta 1 minute less than package.",
      "Make roux: butter + flour, cook 2 minutes.",
      "Whisk in milk, simmer until thick.",
      "Add cheeses, mustard, season.",
      "Combine pasta and sauce, transfer to baking dish.",
      "Top with panko mixed with parmesan and paprika.",
      "Bake at 375°F for 20 minutes until golden."
    ],
    tags: ["popular", "vegetarian"],
    isFavorite: false
  },
  {
    id: 17,
    title: "Shakshuka",
    cuisine: "mediterranean",
    category: "breakfast",
    difficulty: "easy",
    cookingTime: 25,
    servings: 3,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1573672614557-41a177d25b4c?w=800&auto=format&fit=crop",
    description: "Eggs poached in spiced tomato-pepper sauce with warm pita.",
    ingredients: [
      "1 onion, diced",
      "1 red bell pepper, diced",
      "4 garlic cloves",
      "1 tsp cumin",
      "1 tsp paprika",
      "1/2 tsp cayenne",
      "1 can (28oz) crushed tomatoes",
      "4-6 eggs",
      "Feta, crumbled",
      "Cilantro, parsley",
      "Olive oil"
    ],
    instructions: [
      "Sauté onion, pepper in oil until soft.",
      "Add garlic, spices, cook 1 minute.",
      "Add tomatoes, simmer 10 minutes.",
      "Make wells, crack eggs in.",
      "Cover, cook 5-8 minutes until whites set.",
      "Top with feta, herbs. Serve with pita."
    ],
    tags: ["vegetarian", "healthy", "breakfast"],
    isFavorite: true
  },
  {
    id: 18,
    title: "Ramen",
    cuisine: "japanese",
    category: "dinner",
    difficulty: "hard",
    cookingTime: 180,
    servings: 2,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop",
    description: "Rich tonkotsu broth with chashu, ajitama, and springy noodles.",
    ingredients: [
      "Fresh ramen noodles",
      "Pork bones (for broth - 12hr simmer)",
      "Pork belly (chashu)",
      "Soft-boiled eggs (marinated)",
      "Bamboo shoots",
      "Nori",
      "Green onions",
      "Sesame seeds",
      "Tare (soy sauce base)"
    ],
    instructions: [
      "Simmer pork bones 12+ hours for creamy broth.",
      "Braise pork belly in soy, mirin, sake.",
      "Marinate soft-boiled eggs in soy mixture.",
      "Prepare tare in bowls.",
      "Cook noodles separately.",
      "Combine broth + tare, add noodles.",
      "Top with chashu, egg, bamboo, nori, onions."
    ],
    tags: ["non-vegetarian"],
    isFavorite: true
  },
  {
    id: 19,
    title: "Green Curry",
    cuisine: "thai",
    category: "dinner",
    difficulty: "medium",
    cookingTime: 30,
    servings: 4,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop",
    description: "Aromatic coconut curry with chicken, bamboo shoots, and Thai basil.",
    ingredients: [
      "400g chicken, sliced",
      "2 cans coconut milk",
      "3 tbsp green curry paste",
      "1 cup bamboo shoots",
      "Thai eggplants",
      "Thai basil leaves",
      "Fish sauce",
      "Palm sugar",
      "Kaffir lime leaves",
      "Red chilies",
      "Jasmine rice"
    ],
    instructions: [
      "Fry curry paste in coconut cream until fragrant.",
      "Add chicken, cook until sealed.",
      "Add remaining coconut milk, simmer.",
      "Add vegetables, lime leaves.",
      "Season with fish sauce, sugar.",
      "Finish with basil and chilies.",
      "Serve with jasmine rice."
    ],
    tags: ["spicy", "non-vegetarian"],
    isFavorite: false
  },
  {
    id: 20,
    title: "Coq au Vin",
    cuisine: "continental",
    category: "dinner",
    difficulty: "hard",
    cookingTime: 120,
    servings: 4,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1598514982232-611e0a3a94d6?w=800&auto=format&fit=crop",
    description: "Classic French chicken braised in red wine with mushrooms and pearl onions.",
    ingredients: [
      "1.5kg chicken, cut up",
      "750ml red wine (Burgundy)",
      "200g bacon, lardons",
      "250g pearl onions",
      "250g mushrooms",
      "2 carrots, sliced",
      "2 celery stalks",
      "Bouquet garni",
      "2 tbsp brandy",
      "Butter, flour",
      "Parsley"
    ],
    instructions: [
      "Marinate chicken in wine, herbs overnight.",
      "Brown bacon, remove. Brown chicken in fat.",
      "Sauté vegetables, add flour.",
      "Add wine marinade, brandy, bouquet garni.",
      "Simmer 45 minutes.",
      "Separately cook onions and mushrooms in butter.",
      "Combine, reduce sauce, finish with butter.",
      "Garnish with parsley."
    ],
    tags: ["non-vegetarian"],
    isFavorite: false
  }
];

export const getRecipeById = (id) => {
  return recipes.find(recipe => recipe.id === id);
};

export const getRecipesByCuisine = (cuisineId) => {
  return recipes.filter(recipe => recipe.cuisine === cuisineId);
};

export const getRecipesByCategory = (categoryId) => {
  return recipes.filter(recipe => recipe.category === categoryId);
};

export const searchRecipes = (query) => {
  const lowerQuery = query.toLowerCase();
  return recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(lowerQuery) ||
    recipe.description.toLowerCase().includes(lowerQuery) ||
    recipe.cuisine.toLowerCase().includes(lowerQuery)
  );
};

export const getPopularRecipes = () => {
  return recipes.filter(r => r.tags.includes('popular')).slice(0, 8);
};

export const getQuickRecipes = () => {
  return recipes.filter(r => r.cookingTime <= 30).slice(0, 8);
};

export const getTrendingRecipes = () => {
  return [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 8);
};

export const getFavoriteRecipes = () => {
  return recipes.filter(r => r.isFavorite);
};