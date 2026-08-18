import { supabase } from '../lib/supabase';

export const categoryService = {
  async getCuisines() {
    const { data, error } = await supabase
      .from('cuisines')
      .select('*')
      .order('name');

    if (error) throw new Error('Unable to load cuisines');
    return data || [];
  },

  async getCategories(type = null) {
    let query = supabase
      .from('categories')
      .select('*')
      .order('name');

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw new Error('Unable to load categories');
    return data || [];
  },

  async getMealTypes() {
    return this.getCategories('meal');
  },

  async getDietTypes() {
    return this.getCategories('diet');
  },

  async getDifficulties() {
    const { data, error } = await supabase
      .from('difficulties')
      .select('*')
      .order('sort_order');

    if (error) throw new Error('Unable to load difficulties');
    return data || [];
  },

  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw new Error('Unable to load tags');
    return data || [];
  },

  async getRecipeTags(recipeId) {
    const { data, error } = await supabase
      .from('recipe_tags')
      .select('tag:tags(*)')
      .eq('recipe_id', recipeId);

    if (error) throw new Error('Unable to load recipe tags');
    return data?.map(rt => rt.tag) || [];
  },

  async getCookingTimeOptions() {
    return [
      { id: 'under-15', name: 'Under 15 min', value: 15 },
      { id: '15-30', name: '15-30 min', value: 30 },
      { id: '30-60', name: '30-60 min', value: 60 },
      { id: 'over-60', name: 'Over 60 min', value: 120 },
    ];
  },
};

export default categoryService;