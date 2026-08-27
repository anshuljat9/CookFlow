import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SubstitutionRequest {
  missingIngredient: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    preparation?: string;
    role?: string;
  };
  recipe: {
    id: string;
    title: string;
    cuisine?: string;
    category?: string;
    cookingMethod?: string;
    description?: string;
  };
  availableIngredients: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    role?: string;
  }>;
  servings: number;
  originalServings: number;
}

interface SubstitutionOption {
  ingredients: Array<{
    name: string;
    ingredientId?: string;
    quantity: number;
    unit: string;
    preparation?: string;
  }>;
  confidence: "high" | "medium" | "low";
  confidenceScore: number;
  reason: string;
  tasteImpact: string;
  textureImpact: string;
  warnings: string[];
}

interface SubstitutionResponse {
  missingIngredient: {
    name: string;
    quantity: number;
    unit: string;
  };
  substitutions: SubstitutionOption[];
  error?: string;
}

const SUBSTITUTION_PROMPT = `You are a professional culinary substitution assistant for CookFlow. Your task is to suggest safe, practical ingredient substitutions based on what the user has in their kitchen.

RULES:
1. ONLY suggest substitutions using ingredients the user ALREADY HAS (from availableIngredients)
2. Prefer common, proven culinary substitutions
3. Consider the recipe context (cuisine, cooking method, category)
4. Provide EXACT quantities and units
5. Scale quantities for the recipe's serving size
6. NEVER invent ingredients the user doesn't have
7. If no reliable substitution exists with available ingredients, return empty substitutions array
8. Return ONLY valid JSON - no prose, no markdown

CONFIDENCE GUIDELINES:
- high (0.80-1.00): Well-established substitution (e.g., milk+butter for heavy cream, lime for lemon)
- medium (0.60-0.79): Context-dependent but reasonable (e.g., yogurt for sour cream in dips)
- low (<0.60): Experimental or significant compromise (e.g., water for milk in baking)

UNSAFE SUBSTITUTIONS TO REJECT:
- Eggs in meringue → any liquid
- Gelatin → water
- Flour in bread → pure oil without binder
- Any substitution that would fundamentally break the dish structure

OUTPUT FORMAT (strict JSON):
{
  "missingIngredient": {"name": "...", "quantity": ..., "unit": "..."},
  "substitutions": [
    {
      "ingredients": [
        {"name": "...", "ingredientId": "...", "quantity": ..., "unit": "...", "preparation": "..."}
      ],
      "confidence": "high|medium|low",
      "confidenceScore": 0.XX,
      "reason": "Brief culinary reasoning",
      "tasteImpact": "How flavor changes",
      "textureImpact": "How texture changes",
      "warnings": ["Any cautions"]
    }
  ]
}

MAX 3 SUBSTITUTION OPTIONS.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const aiApiKey = Deno.env.get("AI_API_KEY");
    const aiModel = Deno.env.get("AI_MODEL") || "gpt-4o-mini";
    const aiProvider = Deno.env.get("AI_PROVIDER") || "openai";

    if (!aiApiKey) {
      return new Response(JSON.stringify({ 
        error: "AI service not configured",
        substitutions: [] 
      }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: SubstitutionRequest = await req.json();
    
    const { missingIngredient, recipe, availableIngredients, servings, originalServings } = body;

    // Calculate serving scale factor
    const scaleFactor = servings / originalServings;
    const scaledQuantity = missingIngredient.quantity * scaleFactor;

    // Build context for AI
    const availableNames = availableIngredients.map(i => i.name).join(", ");
    const recipeContext = `
Recipe: ${recipe.title}
Cuisine: ${recipe.cuisine || "unknown"}
Category: ${recipe.category || "unknown"}
Cooking Method: ${recipe.cookingMethod || "simmering/stovetop"}
Missing: ${missingIngredient.name} (${scaledQuantity} ${missingIngredient.unit}${missingIngredient.preparation ? `, ${missingIngredient.preparation}` : ""})
Available Kitchen Ingredients: ${availableNames || "none"}
Servings: ${servings} (original: ${originalServings}, scale: ${scaleFactor.toFixed(2)})
`;

    let aiResponse: SubstitutionOption[] = [];

    if (aiProvider === "openai") {
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${aiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: aiModel,
          messages: [
            { role: "system", content: SUBSTITUTION_PROMPT },
            { role: "user", content: recipeContext },
          ],
          temperature: 0.2,
          max_tokens: 1000,
          response_format: { type: "json_object" },
        }),
      });

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const data = await openaiResponse.json();
      const content = data.choices[0]?.message?.content;
      
      if (content) {
        try {
          const parsed = JSON.parse(content);
          aiResponse = parsed.substitutions || [];
        } catch {
          console.error("Failed to parse AI response:", content);
        }
      }
    }

    // Validate and filter AI response
    const validSubstitutions = aiResponse
      .map(sub => {
        // Validate each substitution uses only available ingredients
        const validIngredients = sub.ingredients.filter(ing => 
          availableIngredients.some(avail => 
            avail.name.toLowerCase() === ing.name.toLowerCase()
          )
        );
        
        if (validIngredients.length === 0) return null;
        
        return {
          ...sub,
          ingredients: validIngredients,
        };
      })
      .filter(Boolean) as SubstitutionOption[];

    const response: SubstitutionResponse = {
      missingIngredient: {
        name: missingIngredient.name,
        quantity: scaledQuantity,
        unit: missingIngredient.unit,
      },
      substitutions: validSubstitutions.slice(0, 3),
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI substitution error:", error);
    return new Response(JSON.stringify({ 
      error: "AI service temporarily unavailable",
      substitutions: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});