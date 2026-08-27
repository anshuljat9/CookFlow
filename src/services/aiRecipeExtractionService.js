import { supabase } from '../lib/supabase';

const AI_EDGE_FUNCTION_URL = '/functions/v1/ai-recipe-extraction';

const EXTRACTION_JOB_KEY = 'cookflow_extraction_job_';
const EXTRACTION_HISTORY_KEY = 'cookflow_extraction_history';

const MAX_VIDEO_SIZE_MB = 100;
const MAX_VIDEO_DURATION_SECONDS = 300;
const MAX_IMAGE_SIZE_MB = 10;

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

  // Process URL-based extraction
  async processUrlExtraction(jobId, url, platform) {
    this.updateJob(jobId, { 
      status: 'processing', 
      currentStage: 'Fetching video metadata...',
      progressPercent: 10 
    });

    // For now, we'll simulate the evidence extraction
    // In a real implementation, this would call backend services to:
    // 1. Fetch video metadata/caption
    // 2. Extract transcript (if available via API)
    // 3. Extract frames
    // 4. Run OCR on frames
    // 5. Call AI extraction

    // Simulate stages
    await this.simulateProgress(jobId, [
      { stage: 'extracting_audio', label: 'Extracting audio transcript...', progress: 30 },
      { stage: 'extracting_frames', label: 'Analyzing video frames...', progress: 50 },
      { stage: 'analyzing', label: 'AI recipe analysis...', progress: 70 },
      { stage: 'validating', label: 'Validating extraction...', progress: 90 },
    ]);

    // Call the AI extraction edge function with mock evidence
    // In production, this would use real extracted evidence
    const mockEvidence = this.generateMockEvidence(url, platform);
    
    const result = await this.callExtractionAI(jobId, mockEvidence);
    
    if (result) {
      this.updateJob(jobId, { 
        status: 'completed', 
        currentStage: 'Complete',
        progressPercent: 100,
        extractedData: result,
        updatedAt: new Date().toISOString(),
      });
      return result;
    }

    return null;
  },

  // Process uploaded video
  async processVideoUpload(jobId, file) {
    this.updateJob(jobId, { 
      status: 'processing', 
      currentStage: 'Processing video upload...',
      progressPercent: 10 
    });

    // Get video duration
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

    // Simulate processing stages
    await this.simulateProgress(jobId, [
      { stage: 'extracting_audio', label: 'Extracting audio transcript...', progress: 30 },
      { stage: 'extracting_frames', label: 'Analyzing video frames...', progress: 50 },
      { stage: 'analyzing', label: 'AI recipe analysis...', progress: 70 },
      { stage: 'validating', label: 'Validating extraction...', progress: 90 },
    ]);

    // Call AI with mock evidence (replace with real processing in production)
    const mockEvidence = this.generateMockEvidence(file.name, 'upload', duration);
    const result = await this.callExtractionAI(jobId, mockEvidence);
    
    if (result) {
      this.updateJob(jobId, { 
        status: 'completed', 
        currentStage: 'Complete',
        progressPercent: 100,
        extractedData: result,
        updatedAt: new Date().toISOString(),
      });
      return result;
    }

    return null;
  },

  // Process uploaded image
  async processImageUpload(jobId, file) {
    this.updateJob(jobId, { 
      status: 'processing', 
      currentStage: 'Analyzing image...',
      progressPercent: 20 
    });

    // Simulate image analysis
    await this.simulateProgress(jobId, [
      { stage: 'analyzing', label: 'AI image analysis...', progress: 60 },
      { stage: 'validating', label: 'Validating extraction...', progress: 90 },
    ]);

    const mockEvidence = this.generateMockImageEvidence(file.name);
    const result = await this.callExtractionAI(jobId, mockEvidence);
    
    if (result) {
      this.updateJob(jobId, { 
        status: 'completed', 
        currentStage: 'Complete',
        progressPercent: 100,
        extractedData: result,
        updatedAt: new Date().toISOString(),
      });
      return result;
    }

    return null;
  },

  // Call the AI extraction edge function
  async callExtractionAI(jobId, evidence) {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}${AI_EDGE_FUNCTION_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          jobId,
          sourceType: 'upload',
          ...evidence,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `AI service error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check for AI service errors
      if (data.error) {
        throw new Error(data.error);
      }

      // Validate the response structure
      if (!this.validateExtractionResponse(data)) {
        throw new Error('Invalid extraction response structure');
      }

      return data;
    } catch (error) {
      console.error('AI extraction failed:', error);
      this.updateJob(jobId, { 
        status: 'failed', 
        errorMessage: error instanceof Error ? error.message : 'Extraction failed',
        updatedAt: new Date().toISOString(),
      });
      return null;
    }
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

  // Simulate progress updates
  async simulateProgress(jobId, stages) {
    for (const { stage, label, progress } of stages) {
      this.updateJob(jobId, { 
        status: 'processing', 
        currentStage: label,
        progressPercent: progress,
      });
      // Realistic delay per stage
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    }
  },

  // Generate mock evidence for development/testing
  generateMockEvidence(source, platform, duration) {
    // This simulates what real video processing would produce
    // In production, replace with actual transcript/OCR/frame extraction
    const isKorean = source.toLowerCase().includes('korean') || source.toLowerCase().includes('gochujang');
    
    return {
      transcript: isKorean 
        ? "First, boil your noodles until al dente. Reserve some pasta water. In a large pan, melt butter over medium heat. Add minced garlic and cook until golden and fragrant. Add soy sauce, gochugaru, honey, and sesame oil. Toss in the cooked noodles with the pasta water to create a nice emulsion. Top with green onions and sesame seeds."
        : "Start by heating oil in a large pan. Add diced onions and cook until translucent. Add minced garlic and ginger, cook for 30 seconds. Add your protein and cook until browned. Add tomatoes and spices, simmer for 15 minutes. Finish with fresh cilantro and serve with rice.",
      ocrText: isKorean
        ? "200g spaghetti\n4 tbsp butter\n8 garlic cloves\n2 tbsp soy sauce\n1 tbsp gochugaru\n1 tbsp honey\n1 tsp sesame oil"
        : "2 tbsp oil\n1 onion, diced\n3 garlic cloves\n1 inch ginger\n500g chicken\n2 tomatoes\n1 tsp turmeric\n1 tsp cumin\nSalt to taste",
      frameDescriptions: [
        "Frame 1: Ingredients laid out on counter - noodles, butter, garlic, soy sauce, gochugaru, honey, sesame oil",
        "Frame 2: Noodles boiling in large pot of water",
        "Frame 3: Butter melting in pan, garlic being added",
        "Frame 4: Sauce ingredients being mixed in pan",
        "Frame 5: Noodles tossed in sauce with pasta water",
        "Frame 6: Final dish plated with green onions and sesame seeds garnish"
      ],
      caption: isKorean
        ? "Korean Garlic Noodles 🍜 Quick 15 min recipe! Full recipe in bio #koreanfood #garlicnoodles #easyrecipes"
        : "Butter Chicken Recipe 🍗 Creamy tomato-based curry served with naan. Full recipe in bio! #indianfood #butterchicken #curry",
      metadata: {
        title: isKorean ? "Korean Garlic Noodles - 15 Min Recipe" : "Butter Chicken - Restaurant Style",
        platform,
        hashtags: isKorean ? ["koreanfood", "garlicnoodles", "easyrecipes"] : ["indianfood", "butterchicken", "curry"],
      },
      videoDurationSeconds: duration || 60,
    };
  },

  generateMockImageEvidence(filename) {
    return {
      frameDescriptions: [
        `Food image: ${filename}. A plated dish showing noodles with visible garlic pieces, green onions, and sesame seeds. Sauce appears glossy and coating the noodles.`
      ],
      metadata: {
        filename,
        analysisType: 'image',
      },
    };
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

    const ingredients = data.ingredients.map((ing, index) => ({
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