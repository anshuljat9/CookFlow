import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ExtractionRequest {
  jobId: string;
  sourceType: "url" | "upload" | "image";
  sourceUrl?: string;
  sourcePlatform?: string;
  transcript?: string;
  ocrText?: string;
  frameDescriptions?: string[];
  caption?: string;
  metadata?: Record<string, unknown>;
  videoDurationSeconds?: number;
}

interface IngredientExtraction {
  name: string;
  quantity: number | null;
  unit: string | null;
  preparation: string | null;
  confidenceScore: number;
  source: "transcript" | "ocr" | "visual" | "caption" | "inferred";
  canonicalName?: string;
  isOptional: boolean;
  conflictingInfo?: string;
}

interface StepExtraction {
  stepNumber: number;
  instruction: string;
  durationSeconds: number | null;
  temperature: string | null;
  tip: string | null;
  confidenceScore: number;
  source: "transcript" | "ocr" | "visual" | "caption" | "inferred";
}

interface DishExtraction {
  name: string;
  description: string;
  cuisine: string | null;
  category: string | null;
  confidenceScore: number;
  alternatives: Array<{ name: string; confidenceScore: number }>;
}

interface ExtractionResponse {
  dish: DishExtraction;
  ingredients: IngredientExtraction[];
  steps: StepExtraction[];
  servings: number | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  overallConfidenceScore: number;
  uncertainItems: Array<{
    type: "ingredient" | "step" | "quantity" | "time";
    name: string;
    reason: string;
  }>;
  warnings: string[];
  conflicts: Array<{
    field: string;
    sources: Array<{ source: string; value: string }>;
  }>;
  error?: string;
}

const EXTRACTION_PROMPT = `You are a professional culinary recipe extraction assistant for CookFlow. Your task is to reconstruct a complete, structured recipe from multi-modal evidence provided from a cooking video.

EVIDENCE TYPES YOU MAY RECEIVE:
- Transcript: Spoken audio from the video (with timestamps if available)
- OCR Text: On-screen text detected from video frames (ingredient amounts, instructions)
- Frame Descriptions: Visual analysis of key frames (ingredients visible, cooking actions, final dish)
- Caption: Video description/caption from the platform
- Metadata: Video title, tags, duration, etc.

EXTRACTION RULES:
1. PREFER EXPLICIT EVIDENCE: Use spoken quantities, on-screen text, or caption text before visual inference
2. DO NOT INVENT QUANTITIES: If a quantity is not explicitly stated, mark as null and note "not specified" or "to taste"
3. MARK ESTIMATED INFORMATION: Visual estimates should have lower confidence scores
4. RESOLVE CONFLICTS CONSERVATIVELY: If transcript says "2 tbsp" and OCR says "1 tbsp", flag as conflict, don't silently choose
5. PRESERVE UNCERTAINTY: Use confidence scores honestly; low confidence for visual estimates
6. IDENTIFY DISH ONLY WHEN SUPPORTED: Don't guess dish names from generic footage
7. RETURN STRICT JSON: No prose, no markdown, no extra commentary
8. SEPARATE OBSERVED FROM INFERRED: Use "source" field to track evidence origin
9. USE CANONICAL INGREDIENT NAMES: Map to standard names (e.g., "fresh tomatoes" → "tomato", preparation: "fresh")
10. PROVIDE PREPARATION DETAILS SEPARATELY: "minced", "diced", "sliced" go in preparation field
11. KEEP STEPS IN CHRONOLOGICAL ORDER: Number steps sequentially
12. ESTIMATE SERVINGS ONLY IF EXPLICITLY STATED: Otherwise null

CONFIDENCE GUIDELINES:
- 0.90-1.00: Explicit in transcript/OCR/caption (e.g., "2 tablespoons olive oil" spoken)
- 0.70-0.89: Clear visual evidence + context (e.g., visible measuring spoon + ingredient name spoken)
- 0.50-0.69: Visual inference only (e.g., "appears to be ~1 cup based on bowl size")
- 0.30-0.49: Weak inference, mostly guesswork
- <0.30: Highly uncertain, should be flagged as uncertain

UNSAFE EXTRACTIONS TO REJECT/FLAG:
- Raw chicken cooking without temperature/time specification → flag safety warning
- Pressure cooker instructions without pressure/time → flag
- Deep frying without oil temperature → flag
- Any safety-critical info invented without evidence

OUTPUT FORMAT (strict JSON):
{
  "dish": {
    "name": "Korean Garlic Noodles",
    "description": "Spicy buttery garlic noodles with gochugaru",
    "cuisine": "Korean",
    "category": "main",
    "confidenceScore": 0.92,
    "alternatives": [{"name": "Garlic Butter Noodles", "confidenceScore": 0.15}]
  },
  "ingredients": [
    {
      "name": "spaghetti",
      "quantity": 200,
      "unit": "g",
      "preparation": null,
      "confidenceScore": 0.95,
      "source": "transcript",
      "canonicalName": "pasta",
      "isOptional": false
    },
    {
      "name": "butter",
      "quantity": 4,
      "unit": "tbsp",
      "preparation": null,
      "confidenceScore": 0.90,
      "source": "transcript",
      "canonicalName": "butter",
      "isOptional": false
    },
    {
      "name": "garlic",
      "quantity": 8,
      "unit": "cloves",
      "preparation": "minced",
      "confidenceScore": 0.85,
      "source": "transcript+ocr",
      "canonicalName": "garlic",
      "isOptional": false
    },
    {
      "name": "salt",
      "quantity": null,
      "unit": null,
      "preparation": null,
      "confidenceScore": 0.40,
      "source": "inferred",
      "canonicalName": "salt",
      "isOptional": true,
      "conflictingInfo": "Not explicitly mentioned; inferred for pasta water"
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "instruction": "Cook spaghetti al dente in salted water, reserve 1/2 cup pasta water",
      "durationSeconds": 480,
      "temperature": null,
      "tip": "Reserve pasta water for emulsion",
      "confidenceScore": 0.92,
      "source": "transcript"
    }
  ],
  "servings": 2,
  "prepTimeMinutes": 5,
  "cookTimeMinutes": 10,
  "overallConfidenceScore": 0.87,
  "uncertainItems": [
    {"type": "ingredient", "name": "salt", "reason": "Not explicitly mentioned; inferred for pasta water"},
    {"type": "quantity", "name": "chili flakes", "reason": "Visual estimate only, no explicit measurement"}
  ],
  "warnings": ["Cooking time for pasta not explicitly stated; estimated from visual cues"],
  "conflicts": [
    {"field": "soy sauce quantity", "sources": [{"source": "transcript", "value": "2 tbsp"}, {"source": "ocr", "value": "1 tbsp"}]}
  ]
}

MAX 3 DISH ALTERNATIVES.`;

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
      }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: ExtractionRequest = await req.json();
    
    const { 
      jobId, 
      sourceType, 
      sourceUrl, 
      sourcePlatform, 
      transcript, 
      ocrText, 
      frameDescriptions, 
      caption, 
      metadata,
      videoDurationSeconds 
    } = body;

    // Build evidence context for AI
    const evidenceParts = [];
    
    if (transcript && transcript.trim().length > 0) {
      evidenceParts.push(`VIDEO TRANSCRIPT:\n${transcript}`);
    }
    
    if (ocrText && ocrText.trim().length > 0) {
      evidenceParts.push(`ON-SCREEN TEXT (OCR):\n${ocrText}`);
    }
    
    if (frameDescriptions && frameDescriptions.length > 0) {
      evidenceParts.push(`VISUAL FRAME ANALYSIS:\n${frameDescriptions.join("\n\n")}`);
    }
    
    if (caption && caption.trim().length > 0) {
      evidenceParts.push(`VIDEO CAPTION/DESCRIPTION:\n${caption}`);
    }
    
    if (metadata && Object.keys(metadata).length > 0) {
      evidenceParts.push(`METADATA:\n${JSON.stringify(metadata, null, 2)}`);
    }

    if (videoDurationSeconds) {
      evidenceParts.push(`VIDEO DURATION: ${videoDurationSeconds} seconds`);
    }

    const evidenceContext = evidenceParts.join("\n\n---\n\n");
    
    if (!evidenceContext.trim()) {
      return new Response(JSON.stringify({ 
        error: "No evidence provided for extraction" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let aiResponse: ExtractionResponse | null = null;

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
            { role: "system", content: EXTRACTION_PROMPT },
            { role: "user", content: evidenceContext },
          ],
          temperature: 0.15,
          max_tokens: 3000,
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
          aiResponse = JSON.parse(content);
        } catch (parseError) {
          console.error("Failed to parse AI response:", content);
          return new Response(JSON.stringify({ 
            error: "Failed to parse AI response",
            rawResponse: content 
          }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    if (!aiResponse) {
      return new Response(JSON.stringify({ 
        error: "AI service returned empty response" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate required fields
    if (!aiResponse.dish?.name || !Array.isArray(aiResponse.ingredients) || !Array.isArray(aiResponse.steps)) {
      return new Response(JSON.stringify({ 
        error: "Invalid AI response structure - missing required fields",
        response: aiResponse
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Clamp confidence scores
    aiResponse.overallConfidenceScore = Math.max(0, Math.min(1, aiResponse.overallConfidenceScore || 0.5));
    aiResponse.dish.confidenceScore = Math.max(0, Math.min(1, aiResponse.dish.confidenceScore || 0.5));
    
    aiResponse.ingredients = aiResponse.ingredients.map(ing => ({
      ...ing,
      confidenceScore: Math.max(0, Math.min(1, ing.confidenceScore || 0.5)),
      quantity: ing.quantity === null ? null : Math.max(0, Number(ing.quantity) || 0),
    }));
    
    aiResponse.steps = aiResponse.steps.map(step => ({
      ...step,
      confidenceScore: Math.max(0, Math.min(1, step.confidenceScore || 0.5)),
      durationSeconds: step.durationSeconds === null ? null : Math.max(0, Number(step.durationSeconds) || 0),
    }));

    // Add source metadata to response
    const enrichedResponse = {
      ...aiResponse,
      _metadata: {
        jobId,
        sourceType,
        sourceUrl,
        sourcePlatform,
        extractedAt: new Date().toISOString(),
        evidenceSummary: {
          hasTranscript: !!transcript,
          hasOcr: !!ocrText,
          hasFrames: !!(frameDescriptions && frameDescriptions.length > 0),
          hasCaption: !!caption,
        }
      }
    };

    return new Response(JSON.stringify(enrichedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI recipe extraction error:", error);
    return new Response(JSON.stringify({ 
      error: "AI service temporarily unavailable",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});