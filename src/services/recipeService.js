import { supabase } from '../lib/supabase';

const SUGGESTION_LIMIT = 8;

export const recipeService = {
  async getRecipes(options = {}) {
    const {
      page = 1,
      limit = 12,
      cuisine,
      category,
      mealType,
      dietType,
      difficulty,
      vegetarian,
      vegan,
      glutenFree,
      maxTime,
      minRating,
      search,
      sort = 'relevance',
    } = options;

    let query = supabase
      .from('recipes')
      .select(`
        *,
        cuisine:cuisines(*),
        category:categories!category_id(*),
        meal_type:categories!meal_type_id(*),
        diet_type:categories!diet_type_id(*),
        difficulty:difficulties(*),
        recipe_ingredients(
          quantity,
          unit,
          preparation,
          is_optional,
          ingredient:ingredients(*)
        ),
        recipe_steps(
          step_number,
          instruction,
          duration_seconds,
          temperature,
          tip
        ),
        recipe_tags(
          tag:tags(*)
        )
      `, { count: 'exact' });

    if (cuisine) query = query.eq('cuisine_id', cuisine);
    if (category) query = query.eq('category_id', category);
    if (mealType) query = query.eq('meal_type_id', mealType);
    if (dietType) query = query.eq('diet_type_id', dietType);
    if (difficulty) query = query.eq('difficulty_id', difficulty);
    if (vegetarian) query = query.eq('is_vegetarian', true);
    if (vegan) query = query.eq('is_vegan', true);
    if (glutenFree) query = query.eq('is_gluten_free', true);
    if (maxTime) query = query.lte('total_time_minutes', maxTime);
    if (minRating) query = query.gte('rating', minRating);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    switch (sort) {
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'time-asc':
        query = query.order('total_time_minutes', { ascending: true });
        break;
      case 'time-desc':
        query = query.order('total_time_minutes', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('rating_count', { ascending: false });
        break;
      case 'relevance':
      default:
        if (search) {
          query = query.order('rating_count', { ascending: false });
        } else {
          query = query.order('rating_count', { ascending: false });
        }
        break;
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Unable to load recipes. Please try again.');
    }

    return {
      recipes: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  async getSearchSuggestions(query) {
    if (!query || query.trim().length < 2) return { recipes: [], ingredients: [], cuisines: [] };

    const searchTerm = query.trim().toLowerCase();
    const limit = SUGGESTION_LIMIT;

    try {
      const [recipesResult, ingredientsResult, cuisinesResult] = await Promise.all([
        supabase
          .from('recipes')
          .select('id, title, cuisine:cuisines(name, icon)')
          .ilike('title', `%${searchTerm}%`)
          .order('rating_count', { ascending: false })
          .limit(5),
        supabase
          .from('ingredients')
          .select('id, name')
          .ilike('name', `%${searchTerm}%`)
          .order('name')
          .limit(4),
        supabase
          .from('cuisines')
          .select('id, name, icon')
          .ilike('name', `%${searchTerm}%`)
          .order('name')
          .limit(3),
      ]);

      return {
        recipes: recipesResult.data || [],
        ingredients: ingredientsResult.data || [],
        cuisines: cuisinesResult.data || [],
      };
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      return { recipes: [], ingredients: [], cuisines: [] };
    }
  },

  async getPopularRecipes(limit = 8) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        cuisine:cuisines(*),
        difficulty:difficulties(*),
        recipe_tags(tag:tags(*))
      `)
      .order('rating_count', { ascending: false })
      .limit(limit);

    if (error) throw new Error('Unable to load popular recipes');
    return data || [];
  },

  async getQuickRecipes(limit = 8, maxMinutes = 30) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        cuisine:cuisines(*),
        difficulty:difficulties(*),
        recipe_tags(tag:tags(*))
      `)
      .lte('total_time_minutes', maxMinutes)
      .order('total_time_minutes', { ascending: true })
      .limit(limit);

    if (error) throw new Error('Unable to load quick recipes');
    return data || [];
  },

  async getTrendingRecipes(limit = 8) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        cuisine:cuisines(*),
        difficulty:difficulties(*),
        recipe_tags(tag:tags(*))
      `)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw new Error('Unable to load trending recipes');
    return data || [];
  },

  async getRecipesByCuisine(cuisineId, options = {}) {
    return this.getRecipes({ ...options, cuisine: cuisineId });
  },

  async getRecipesByCategory(categoryId, options = {}) {
    return this.getRecipes({ ...options, category: categoryId });
  },

  async getRecipesByMealType(mealTypeId, options = {}) {
    return this.getRecipes({ ...options, mealType: mealTypeId });
  },

  async getRecipesByDiet(dietId, options = {}) {
    return this.getRecipes({ ...options, dietType: dietId });
  },

  async getRecipesByIds(ids) {
    if (!ids.length) return [];
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        cuisine:cuisines(*),
        difficulty:difficulties(*),
        recipe_tags(tag:tags(*))
      `)
      .in('id', ids);

    if (error) throw new Error('Unable to load recipes');
    return data || [];
  },

  async createRecipe(recipeData) {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRecipe(id, updates) {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRecipe(id) {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async getRecipeById(id) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        cuisine:cuisines(*),
        category:categories!category_id(*),
        meal_type:categories!meal_type_id(*),
        diet_type:categories!diet_type_id(*),
        difficulty:difficulties(*),
        recipe_ingredients(
          quantity,
          unit,
          preparation,
          is_optional,
          sort_order,
          ingredient:ingredients(*)
        ),
        recipe_steps(
          step_number,
          instruction,
          duration_seconds,
          temperature,
          tip
        ),
        recipe_tags(
          tag:tags(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching recipe:', error);
      throw new Error('Recipe not found');
    }

    return data;
  },

  async getRecipeBySlug(slug) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        cuisine:cuisines(*),
        category:categories!category_id(*),
        meal_type:categories!meal_type_id(*),
        diet_type:categories!diet_type_id(*),
        difficulty:difficulties(*),
        recipe_ingredients(
          quantity,
          unit,
          preparation,
          is_optional,
          sort_order,
          ingredient:ingredients(*)
        ),
        recipe_steps(
          step_number,
          instruction,
          duration_seconds,
          temperature,
          tip
        ),
        recipe_tags(
          tag:tags(*)
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching recipe by slug:', error);
      throw new Error('Recipe not found');
    }

    return data;
  },
};

export default recipeService;