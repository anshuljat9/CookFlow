import { supabase } from '../lib/supabase';

const VIDEO_PROCESSING_FUNCTION_URL = '/functions/v1/video-processing';

const EXTRACTION_JOB_KEY = 'cookflow_extraction_job_';
const EXTRACTION_HISTORY_KEY = 'cookflow_extraction_history';

const MAX_VIDEO_SIZE_MB = 100;
const MAX_VIDEO_DURATION_SECONDS = 300;
const MAX_IMAGE_SIZE_MB = 10;

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 150; // 5 minutes max

function getJobKey(jobId) {
  return `${EXTRACTION_JOB_KEY}${jobId}`;
}

function getHistoryKey() {
  return EXTRACTION_HISTORY_KEY;
}

export const aiRecipeExtractionService = {
  // Create a new extraction job
  async createJob(data) {
    const jobId = crypto.randomUUID();
    const job = {
      id: jobId,
      sourceType: data.sourceType,
      sourceUrl: data.sourceUrl,
      sourcePlatform: data.sourcePlatform,
      fileName: data.fileName,
      fileSize: data.fileSize,
      videoDuration: data.videoDuration,
      status: 'queued',
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveJob(job);
    this.addToHistory(jobId);
    
    return job;
  },

  // Save job to localStorage
  saveJob(job) {
    try {
      localStorage.setItem(getJobKey(job.id), JSON.stringify(job));
    } catch (error) {
      console.error('Failed to save extraction job:', error);
    }
  },

  // Load job from localStorage
  loadJob(jobId) {
    try {
      const stored = localStorage.getItem(getJobKey(jobId));
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // Update job status
  updateJob(jobId, updates) {
    const job = this.loadJob(jobId);
    if (!job) return null;

    const updated = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.saveJob(updated);
    return updated;
  },

  // Get extraction history
  getHistory() {
    try {
      const stored = localStorage.getItem(getHistoryKey());
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Add job to history
  addToHistory(jobId) {
    try {
      const history = this.getHistory();
      if (!history.includes(jobId)) {
        history.unshift(jobId);
        // Keep last 50 jobs
        if (history.length > 50) history.pop();
        localStorage.setItem(getHistoryKey(), JSON.stringify(history));
      }
    } catch {
      // Ignore
    }
  },

  // Clear history
  clearHistory() {
    try {
      localStorage.removeItem(getHistoryKey());
    } catch {
      // Ignore
    }
  },

  // Validate video file
  validateVideoFile(file) {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'];
    const maxSize = MAX_VIDEO_SIZE_MB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported video format. Please use MP4, WebM, or MOV.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: `Video file too large. Maximum size is ${MAX_VIDEO_SIZE_MB}MB.` };
    }

    return { valid: true };
  },

  // Validate image file
  validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = MAX_IMAGE_SIZE_MB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported image format. Please use JPG, PNG, or WebP.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: `Image file too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.` };
    }

    return { valid: true };
  },

  // Get video duration from file (client-side estimation)
  async getVideoDuration(file) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        resolve(null);
      };
      video.src = URL.createObjectURL(file);
    });
  },

  // Upload file to Supabase Storage
  async uploadFile(file, folder = 'video-uploads') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('video-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return data.path;
  },

  // Poll job status from backend
  async pollJobStatus(jobId, onProgress) {
    let attempts = 0;
    
    while (attempts < MAX_POLL_ATTEMPTS) {
      const { data: job, error } = await supabase
        .from('video_extraction_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Poll error:', error);
        // Fall back to localStorage
        const localJob = this.loadJob(jobId);
        if (localJob) {
          onProgress?.(localJob);
          if (localJob.status === 'completed' || localJob.status === 'failed') {
            return localJob;
          }
        }
      } else if (job) {
        // Update localStorage with latest status
        this.updateJob(jobId, {
          status: job.status,
          currentStage: job.current_stage,
          progressPercent: job.progress_percent,
          errorMessage: job.error_message,
          extractedData: job.extracted_data,
          extractedRecipeId: job.extracted_recipe_id,
        });

        onProgress?.(job);

        if (job.status === 'completed') {
          return job;
        }
        if (job.status === 'failed') {
          throw new Error(job.error_message || 'Processing failed');
        }
        if (job.status === 'cancelled') {
          throw new Error('Analysis was cancelled');
        }
      }

      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
      attempts++;
    }

    throw new Error('Processing timed out. Please try again.');
  },

  // Process URL-based extraction
  async processUrlExtraction(jobId, url, platform) {
    // Start backend processing
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}${VIDEO_PROCESSING_FUNCTION_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        jobId,
        sourceType: 'url',
        sourceUrl: url,
        sourcePlatform: platform,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Processing failed: ${response.status}`);
    }

    // Poll for completion
    return new Promise((resolve, reject) => {
      this.pollJobStatus(jobId, (job) => {
        // Update progress in UI via localStorage
        this.updateJob(jobId, {
          status: job.status,
          currentStage: job.current_stage,
          progressPercent: job.progress_percent,
          errorMessage: job.error_message,
        });
      })
        .then(async (job) => {
          if (job.extracted_data) {
            this.updateJob(jobId, {
              status: 'completed',
              extractedData: job.extracted_data,
            });
            resolve(job.extracted_data);
          } else if (job.extracted_recipe_id) {
            // Recipe was saved, fetch it
            const { data: recipe } = await supabase
              .from('recipes')
              .select('*')
              .eq('id', job.extracted_recipe_id)
              .single();
            resolve(recipe);
          } else {
            reject(new Error('No extraction result'));
          }
        })
        .catch(reject);
    });
  },

  // Process uploaded video
  async processVideoUpload(jobId, file) {
    // Validate duration
    const duration = await this.getVideoDuration(file);
    if (duration && duration > MAX_VIDEO_DURATION_SECONDS) {
      this.updateJob(jobId, { 
        status: 'failed', 
        errorMessage: `Video too long. Maximum duration is ${MAX_VIDEO_DURATION_SECONDS} seconds.`,
        updatedAt: new Date().toISOString(),
      });
      return null;
    }

    this.updateJob(jobId, { videoDuration: duration });

    // Upload to Supabase Storage
    const filePath = await this.uploadFile(file);

    // Update job with file path
    await supabase
      .from('video_extraction_jobs')
      .update({ 
        original_filename: file.name,
        file_size_bytes: file.size,
        video_duration_seconds: duration,
      })
      .eq('id', jobId);

    // Start backend processing
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}${VIDEO_PROCESSING_FUNCTION_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        jobId,
        sourceType: 'upload',
        filePath,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Processing failed: ${response.status}`);
    }

    // Poll for completion
    return new Promise((resolve, reject) => {
      this.pollJobStatus(jobId, (job) => {
        this.updateJob(jobId, {
          status: job.status,
          currentStage: job.current_stage,
          progressPercent: job.progress_percent,
          errorMessage: job.error_message,
        });
      })
        .then((job) => {
          if (job.extracted_data) {
            this.updateJob(jobId, {
              status: 'completed',
              extractedData: job.extracted_data,
            });
            resolve(job.extracted_data);
          } else {
            reject(new Error('No extraction result'));
          }
        })
        .catch(reject);
    });
  },

  // Process uploaded image
  async processImageUpload(jobId, file) {
    // Upload to Supabase Storage
    const filePath = await this.uploadFile(file);

    // Update job with file path
    await supabase
      .from('video_extraction_jobs')
      .update({ 
        original_filename: file.name,
        file_size_bytes: file.size,
      })
      .eq('id', jobId);

    // Start backend processing
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}${VIDEO_PROCESSING_FUNCTION_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        jobId,
        sourceType: 'image',
        filePath,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Processing failed: ${response.status}`);
    }

    // Poll for completion
    return new Promise((resolve, reject) => {
      this.pollJobStatus(jobId, (job) => {
        this.updateJob(jobId, {
          status: job.status,
          currentStage: job.current_stage,
          progressPercent: job.progress_percent,
          errorMessage: job.error_message,
        });
      })
        .then((job) => {
          if (job.extracted_data) {
            this.updateJob(jobId, {
              status: 'completed',
              extractedData: job.extracted_data,
            });
            resolve(job.extracted_data);
          } else {
            reject(new Error('No extraction result'));
          }
        })
        .catch(reject);
    });
  },

  // Validate extraction response
  validateExtractionResponse(data) {
    if (!data || typeof data !== 'object') return false;
    
    const d = data;
    
    // Required fields
    if (!d.dish || typeof d.dish !== 'object') return false;
    if (!Array.isArray(d.ingredients)) return false;
    if (!Array.isArray(d.steps)) return false;
    
    // Dish must have name
    const dish = d.dish;
    if (!dish.name || typeof dish.name !== 'string') return false;
    
    // Ingredients must have name
    for (const ing of d.ingredients) {
      if (!ing || typeof ing !== 'object') return false;
      if (!ing.name || typeof ing.name !== 'string') return false;
    }
    
    // Steps must have instruction
    for (const step of d.steps) {
      if (!step || typeof step !== 'object') return false;
      if (!step.instruction || typeof step.instruction !== 'string') return false;
    }
    
    return true;
  },

  // Convert extracted data to recipe format for saving
  convertToRecipeFormat(data, sourceInfo) {
    // Generate slug from dish name
    const slug = data.dish.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const recipe = {
      title: data.dish.name,
      slug: `${slug}-${Date.now().toString(36).slice(-6)}`,
      description: data.dish.description || `AI-extracted recipe from ${sourceInfo.sourceType}`,
      image_url: null,
      cuisine_id: data.dish.cuisine?.toLowerCase() || null,
      category_id: data.dish.category?.toLowerCase() || null,
      meal_type_id: null,
      diet_type_id: null,
      difficulty_id: this.estimateDifficulty(data),
      prep_time_minutes: data.prepTimeMinutes || 0,
      cook_time_minutes: data.cookTimeMinutes || 0,
      servings: data.servings || 1,
      rating: 0,
      rating_count: 0,
      calories: null,
      is_vegetarian: this.checkVegetarian(data),
      is_vegan: this.checkVegan(data),
      is_gluten_free: this.checkGlutenFree(data),
      source_type: 'ai_generated',
      source_url: sourceInfo.sourceUrl || null,
      source_platform: sourceInfo.sourcePlatform || null,
      ai_generated: true,
      ai_confidence: data.overallConfidenceScore,
      source_creator: null,
    };

    const ingredients = data.ingredients.map(ing => ({
      ingredientId: ing.canonicalName ? undefined : undefined, // Will be resolved during save
      name: ing.name,
      quantity: ing.quantity || 0,
      unit: ing.unit || 'unit',
      preparation: ing.preparation || undefined,
      isOptional: ing.isOptional || false,
      confidenceScore: ing.confidenceScore,
      source: ing.source,
      canonicalName: ing.canonicalName,
    }));

    const steps = data.steps.map(step => ({
      stepNumber: step.stepNumber,
      instruction: step.instruction,
      durationSeconds: step.durationSeconds || undefined,
      temperature: step.temperature || undefined,
      tip: step.tip || undefined,
      confidenceScore: step.confidenceScore,
      source: step.source,
    }));

    const confidenceBreakdown = {
      dish: data.dish.confidenceScore,
      ingredients: data.ingredients.length > 0 
        ? data.ingredients.reduce((sum, i) => sum + i.confidenceScore, 0) / data.ingredients.length 
        : 0,
      quantities: data.ingredients.length > 0
        ? data.ingredients
            .filter(i => i.quantity !== null)
            .reduce((sum, i) => sum + i.confidenceScore, 0) / 
          Math.max(1, data.ingredients.filter(i => i.quantity !== null).length)
        : 0,
      steps: data.steps.length > 0
        ? data.steps.reduce((sum, s) => sum + s.confidenceScore, 0) / data.steps.length
        : 0,
      overall: data.overallConfidenceScore,
    };

    const evidence = {
      ingredients: data.ingredients.map(i => ({
        name: i.name,
        source: i.source,
        confidence: i.confidenceScore,
      })),
      steps: data.steps.map(s => ({
        stepNumber: s.stepNumber,
        source: s.source,
        confidence: s.confidenceScore,
      })),
    };

    return {
      recipe,
      ingredients,
      steps,
      confidenceBreakdown,
      evidence,
      uncertainItems: data.uncertainItems,
      warnings: data.warnings,
      conflicts: data.conflicts,
    };
  },

  estimateDifficulty(data) {
    const stepCount = data.steps.length;
    const hasComplexTechniques = data.steps.some(s => 
      s.instruction.toLowerCase().includes('temper') ||
      s.instruction.toLowerCase().includes('emulsion') ||
      s.instruction.toLowerCase().includes('fold') ||
      s.instruction.toLowerCase().includes('whip') ||
      s.instruction.toLowerCase().includes('caramelize') ||
      s.instruction.toLowerCase().includes('pressure cook') ||
      s.instruction.toLowerCase().includes('deep fry')
    );
    
    const totalTime = (data.prepTimeMinutes || 0) + (data.cookTimeMinutes || 0);
    
    if (hasComplexTechniques || stepCount > 8 || totalTime > 60) return 'hard';
    if (stepCount > 5 || totalTime > 30) return 'medium';
    return 'easy';
  },

  checkVegetarian(data) {
    const nonVegKeywords = ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'bacon', 'meat', 'lamb', 'turkey', 'duck'];
    return !data.ingredients.some(ing => 
      nonVegKeywords.some(kw => ing.name.toLowerCase().includes(kw))
    );
  },

  checkVegan(data) {
    const nonVeganKeywords = ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'bacon', 'meat', 'lamb', 'turkey', 'duck', 'butter', 'cream', 'milk', 'cheese', 'yogurt', 'egg', 'honey', 'ghee'];
    return !data.ingredients.some(ing => 
      nonVeganKeywords.some(kw => ing.name.toLowerCase().includes(kw))
    );
  },

  checkGlutenFree(data) {
    const glutenKeywords = ['wheat', 'flour', 'bread', 'pasta', 'noodles', 'soy sauce', 'teriyaki', 'seitan', 'couscous', 'bulgur', 'spelt', 'kamut', 'rye', 'barley'];
    return !data.ingredients.some(ing => 
      glutenKeywords.some(kw => ing.name.toLowerCase().includes(kw))
    );
  },

  // Save the extracted recipe to the database
  async saveExtractedRecipe(convertedData) {
    try {
      // First, create or get ingredient IDs
      const ingredientIds = [];
      
      for (const ing of convertedData.ingredients) {
        let ingredientId = undefined;
        
        if (ing.canonicalName) {
          // Try to find existing ingredient by canonical name
          const { data: existing } = await supabase
            .from('ingredients')
            .select('id')
            .eq('canonical_name', ing.canonicalName)
            .single();
          
          if (existing) {
            ingredientId = existing.id;
          }
        }
        
        if (!ingredientId) {
          // Search by name
          const { data: existing } = await supabase
            .from('ingredients')
            .select('id')
            .ilike('name', ing.name)
            .limit(1)
            .single();
          
          if (existing) {
            ingredientId = existing.id;
          }
        }
        
        ingredientIds.push(ingredientId || '');
      }

      // Create recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          ...convertedData.recipe,
          extraction_status: 'completed',
          extraction_job_id: convertedData.jobId,
          extraction_confidence_breakdown: convertedData.confidenceBreakdown,
          extraction_evidence: convertedData.evidence,
          extraction_warnings: convertedData.warnings,
          extraction_uncertain_items: convertedData.uncertainItems,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Insert recipe ingredients
      const recipeIngredients = convertedData.ingredients.map((ing, index) => ({
        recipe_id: recipe.id,
        ingredient_id: ingredientIds[index] || null,
        quantity: ing.quantity,
        unit: ing.unit,
        preparation: ing.preparation || null,
        is_optional: ing.isOptional,
        sort_order: index,
      }));

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(recipeIngredients);

      if (ingredientsError) throw ingredientsError;

      // Insert recipe steps
      const recipeSteps = convertedData.steps.map(step => ({
        recipe_id: recipe.id,
        step_number: step.stepNumber,
        instruction: step.instruction,
        duration_seconds: step.durationSeconds || null,
        temperature: step.temperature || null,
        tip: step.tip || null,
      }));

      const { error: stepsError } = await supabase
        .from('recipe_steps')
        .insert(recipeSteps);

      if (stepsError) throw stepsError;

      // Update extraction job with recipe ID
      if (convertedData.jobId) {
        await supabase
          .from('video_extraction_jobs')
          .update({ 
            extracted_recipe_id: recipe.id,
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', convertedData.jobId);
      }

      return recipe.id;
    } catch (error) {
      console.error('Failed to save extracted recipe:', error);
      throw error;
    }
  },

  // Clean up old jobs (keep last 50)
  cleanupOldJobs() {
    try {
      const history = this.getHistory();
      const toKeep = history.slice(0, 50);
      const toRemove = history.slice(50);
      
      toRemove.forEach(jobId => {
        localStorage.removeItem(getJobKey(jobId));
      });
      
      if (toRemove.length > 0) {
        localStorage.setItem(getHistoryKey(), JSON.stringify(toKeep));
      }
    } catch {
      // Ignore
    }
  },

  // Get configuration constants
  getConfig() {
    return {
      MAX_VIDEO_SIZE_MB,
      MAX_VIDEO_DURATION_SECONDS,
      MAX_IMAGE_SIZE_MB,
    };
  },
};

export default aiRecipeExtractionService;