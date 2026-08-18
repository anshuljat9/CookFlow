import { supabase } from '../lib/supabase';

export const ingredientService = {
  async getAllIngredients() {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name');

    if (error) throw new Error('Unable to load ingredients');
    return data || [];
  },

  async getIngredientsByCategory(categoryId) {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('category', categoryId)
      .order('name');

    if (error) throw new Error('Unable to load ingredients');
    return data || [];
  },

  async searchIngredients(query) {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name');

    if (error) throw new Error('Unable to search ingredients');
    return data || [];
  },

  async getIngredientById(id) {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Ingredient not found');
    return data;
  },

  async getRecipeIngredients(recipeId) {
    const { data, error } = await supabase
      .from('recipe_ingredients')
      .select(`
        quantity,
        unit,
        preparation,
        is_optional,
        sort_order,
        ingredient:ingredients(*)
      `)
      .eq('recipe_id', recipeId)
      .order('sort_order');

    if (error) throw new Error('Unable to load recipe ingredients');
    return data || [];
  },

  async getIngredientCategories() {
    const { data, error } = await supabase
      .from('ingredient_categories')
      .select('*')
      .order('name');

    if (error) throw new Error('Unable to load ingredient categories');
    return data || [];
  },

  async scaleIngredients(recipeId, targetServings) {
    const { data: recipe } = await supabase
      .from('recipes')
      .select('servings')
      .eq('id', recipeId)
      .single();

    if (!recipe) throw new Error('Recipe not found');

    const ingredients = await this.getRecipeIngredients(recipeId);
    const scaleFactor = targetServings / recipe.servings;

    return ingredients.map(ri => ({
      ...ri,
      scaledQuantity: Math.round(ri.quantity * scaleFactor * 100) / 100,
      originalQuantity: ri.quantity,
    }));
  },
};

export default ingredientService;