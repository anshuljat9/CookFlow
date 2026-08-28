import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "supabase";
import { YoutubeTranscript } from "youtube-transcript";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

interface VideoProcessingRequest {
  jobId: string;
  sourceType: "url" | "upload" | "image";
  sourceUrl?: string;
  sourcePlatform?: string;
  filePath?: string; // Supabase Storage path for uploads
}

interface VideoEvidence {
  transcript?: string;
  ocrText?: string;
  frameDescriptions?: string[];
  caption?: string;
  metadata?: Record<string, unknown>;
  videoDurationSeconds?: number;
}

interface ProcessingStage {
  stage: string;
  progress: number;
  message: string;
}

// YouTube transcript fetching
async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(t => t.text).join(" ");
  } catch (error) {
    console.warn("Failed to fetch YouTube transcript:", error);
    return null;
  }
}

// Extract YouTube video ID from URL
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Fetch video metadata from URL (basic HTTP HEAD request)
async function fetchVideoMetadata(url: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");
    return {
      contentType,
      contentLength: contentLength ? parseInt(contentLength) : null,
      accessible: response.ok,
    };
  } catch {
    return { accessible: false };
  }
}

// Generate frame descriptions using AI vision (placeholder - would use GPT-4V or similar)
async function generateFrameDescriptions(
  frameUrls: string[],
  aiApiKey: string,
  aiModel: string
): Promise<string[]> {
  // In production, this would send frames to a vision model
  // For now, return placeholder descriptions
  return frameUrls.map((url, i) => 
    `Frame ${i + 1}: Video frame from ${url} - visual analysis would be performed here`
  );
}

// Extract frames from video (placeholder - would use ffmpeg in a worker)
async function extractFramesFromVideo(
  videoUrl: string,
  maxFrames: number = 10
): Promise<string[]> {
  // In production, this would:
  // 1. Download video to temp storage
  // 2. Use ffmpeg to extract frames at key intervals
  // 3. Upload frames to Supabase Storage
  // 4. Return frame URLs
  
  // For MVP, return placeholder
  return Array.from({ length: Math.min(maxFrames, 6) }, (_, i) => 
    `frame-${i + 1}.jpg`
  );
}

// Run OCR on frames (placeholder - would use Tesseract or cloud vision API)
async function runOCROnFrames(frameUrls: string[]): Promise<string> {
  // In production, this would send frames to OCR service
  return "";
}

// Process YouTube video
async function processYouTubeVideo(
  jobId: string,
  url: string,
  supabaseClient: ReturnType<typeof createClient>
): Promise<VideoEvidence> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) throw new Error("Invalid YouTube URL");

  // Update job status
  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "extracting_audio",
      current_stage: "Fetching YouTube transcript...",
      progress_percent: 20,
    })
    .eq("id", jobId);

  // Fetch transcript
  const transcript = await fetchYouTubeTranscript(videoId);

  // Update job status
  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "extracting_frames",
      current_stage: "Analyzing video frames...",
      progress_percent: 40,
    })
    .eq("id", jobId);

  // For YouTube, we can't easily extract frames without downloading
  // In production, use yt-dlp to download and process
  const frameDescriptions = [
    `YouTube video: ${url} (ID: ${videoId})`,
    "Frame sampling would be performed on downloaded video",
  ];

  // Update job status
  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "analyzing",
      current_stage: "Running OCR on frames...",
      progress_percent: 60,
    })
    .eq("id", jobId);

  // Run OCR (placeholder)
  const ocrText = await runOCROnFrames([]);

  // Fetch video metadata/caption
  const metadata = await fetchVideoMetadata(url);

  return {
    transcript: transcript || undefined,
    ocrText: ocrText || undefined,
    frameDescriptions,
    caption: metadata.description as string || undefined,
    metadata: {
      platform: "youtube",
      videoId,
      title: metadata.title,
      ...metadata,
    },
    videoDurationSeconds: metadata.duration as number,
  };
}

// Process direct video URL
async function processDirectVideoUrl(
  jobId: string,
  url: string,
  supabaseClient: ReturnType<typeof createClient>
): Promise<VideoEvidence> {
  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "extracting_audio",
      current_stage: "Fetching video metadata...",
      progress_percent: 15,
    })
    .eq("id", jobId);

  const metadata = await fetchVideoMetadata(url);
  
  if (!metadata.accessible) {
    throw new Error("Video URL is not accessible. Please upload the video file directly.");
  }

  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "extracting_audio",
      current_stage: "Extracting audio transcript...",
      progress_percent: 30,
    })
    .eq("id", jobId);

  // In production: download video, extract audio, run speech-to-text
  const transcript = ""; // Placeholder

  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "extracting_frames",
      current_stage: "Sampling video frames...",
      progress_percent: 50,
    })
    .eq("id", jobId);

  // In production: extract frames
  const frameUrls = await extractFramesFromVideo(url);
  const frameDescriptions = await generateFrameDescriptions(frameUrls, "", "");

  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "analyzing",
      current_stage: "Running OCR on frames...",
      progress_percent: 70,
    })
    .eq("id", jobId);

  const ocrText = await runOCROnFrames(frameUrls);

  return {
    transcript: transcript || undefined,
    ocrText: ocrText || undefined,
    frameDescriptions,
    caption: undefined,
    metadata: {
      platform: "direct",
      sourceUrl: url,
      ...metadata,
    },
    videoDurationSeconds: metadata.duration as number,
  };
}

// Process uploaded video from Supabase Storage
async function processUploadedVideo(
  jobId: string,
  filePath: string,
  supabaseClient: ReturnType<typeof createClient>
): Promise<VideoEvidence> {
  // Get signed URL for the uploaded video
  const { data: signedUrlData } = await supabaseClient.storage
    .from("video-uploads")
    .createSignedUrl(filePath, 3600);

  if (!signedUrlData?.signedUrl) {
    throw new Error("Failed to access uploaded video");
  }

  const videoUrl = signedUrlData.signedUrl;

  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "extracting_audio",
      current_stage: "Extracting audio from uploaded video...",
      progress_percent: 20,
    })
    .eq("id", jobId);

  // In production: download, extract audio, speech-to-text
  const transcript = "";

  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "extracting_frames",
      current_stage: "Sampling frames from uploaded video...",
      progress_percent: 45,
    })
    .eq("id", jobId);

  const frameUrls = await extractFramesFromVideo(videoUrl);
  const frameDescriptions = await generateFrameDescriptions(frameUrls, "", "");

  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "analyzing",
      current_stage: "Running OCR on frames...",
      progress_percent: 65,
    })
    .eq("id", jobId);

  const ocrText = await runOCROnFrames(frameUrls);

  return {
    transcript: transcript || undefined,
    ocrText: ocrText || undefined,
    frameDescriptions,
    caption: undefined,
    metadata: {
      platform: "upload",
      filePath,
    },
    videoDurationSeconds: undefined,
  };
}

// Process uploaded image
async function processUploadedImage(
  jobId: string,
  filePath: string,
  supabaseClient: ReturnType<typeof createClient>
): Promise<VideoEvidence> {
  const { data: signedUrlData } = await supabaseClient.storage
    .from("video-uploads")
    .createSignedUrl(filePath, 3600);

  if (!signedUrlData?.signedUrl) {
    throw new Error("Failed to access uploaded image");
  }

  await supabaseClient
    .from("video_extraction_jobs")
    .update({ 
      status: "analyzing",
      current_stage: "Analyzing uploaded image...",
      progress_percent: 40,
    })
    .eq("id", jobId);

  // In production: send image to vision AI for analysis
  const frameDescriptions = [
    `Uploaded food image: ${filePath}`,
    "Image analysis would identify dish, visible ingredients, and cooking state",
  ];

  const ocrText = await runOCROnFrames([signedUrlData.signedUrl]);

  return {
    transcript: undefined,
    ocrText: ocrText || undefined,
    frameDescriptions,
    caption: undefined,
    metadata: {
      platform: "upload",
      filePath,
      analysisType: "image",
    },
    videoDurationSeconds: undefined,
  };
}

// Call AI recipe extraction function
async function callAIExtraction(
  jobId: string,
  evidence: VideoEvidence,
  sourceType: string,
  sourceUrl?: string,
  sourcePlatform?: string
): Promise<Response> {
  const aiApiKey = Deno.env.get("AI_API_KEY");
  const aiModel = Deno.env.get("AI_MODEL") || "gpt-4o-mini";
  const aiProvider = Deno.env.get("AI_PROVIDER") || "openai";

  if (!aiApiKey) {
    throw new Error("AI service not configured");
  }

  // Build evidence context
  const evidenceParts = [];
  
  if (evidence.transcript?.trim()) {
    evidenceParts.push(`VIDEO TRANSCRIPT:\n${evidence.transcript}`);
  }
  
  if (evidence.ocrText?.trim()) {
    evidenceParts.push(`ON-SCREEN TEXT (OCR):\n${evidence.ocrText}`);
  }
  
  if (evidence.frameDescriptions?.length) {
    evidenceParts.push(`VISUAL FRAME ANALYSIS:\n${evidence.frameDescriptions.join("\n\n")}`);
  }
  
  if (evidence.caption?.trim()) {
    evidenceParts.push(`VIDEO CAPTION/DESCRIPTION:\n${evidence.caption}`);
  }
  
  if (evidence.metadata && Object.keys(evidence.metadata).length > 0) {
    evidenceParts.push(`METADATA:\n${JSON.stringify(evidence.metadata, null, 2)}`);
  }

  if (evidence.videoDurationSeconds) {
    evidenceParts.push(`VIDEO DURATION: ${evidence.videoDurationSeconds} seconds`);
  }

  const evidenceContext = evidenceParts.join("\n\n---\n\n");

  if (!evidenceContext.trim()) {
    throw new Error("No evidence could be extracted from the video");
  }

  // Import the extraction prompt from the AI extraction function
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

  let aiResponse = null;

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
        throw new Error("Failed to parse AI response");
      }
    }
  }

  if (!aiResponse) {
    throw new Error("AI service returned empty response");
  }

  // Validate required fields
  if (!aiResponse.dish?.name || !Array.isArray(aiResponse.ingredients) || !Array.isArray(aiResponse.steps)) {
    throw new Error("Invalid AI response structure - missing required fields");
  }

  // Clamp confidence scores
  aiResponse.overallConfidenceScore = Math.max(0, Math.min(1, aiResponse.overallConfidenceScore || 0.5));
  aiResponse.dish.confidenceScore = Math.max(0, Math.min(1, aiResponse.dish.confidenceScore || 0.5));
  
  aiResponse.ingredients = aiResponse.ingredients.map((ing: any) => ({
    ...ing,
    confidenceScore: Math.max(0, Math.min(1, ing.confidenceScore || 0.5)),
    quantity: ing.quantity === null ? null : Math.max(0, Number(ing.quantity) || 0),
  }));
  
  aiResponse.steps = aiResponse.steps.map((step: any) => ({
    ...step,
    confidenceScore: Math.max(0, Math.min(1, step.confidenceScore || 0.5)),
    durationSeconds: step.durationSeconds === null ? null : Math.max(0, Number(step.durationSeconds) || 0),
  }));

  // Add metadata
  const enrichedResponse = {
    ...aiResponse,
    _metadata: {
      jobId,
      sourceType,
      sourceUrl,
      sourcePlatform,
      extractedAt: new Date().toISOString(),
      evidenceSummary: {
        hasTranscript: !!evidence.transcript,
        hasOcr: !!evidence.ocrText,
        hasFrames: !!(evidence.frameDescriptions && evidence.frameDescriptions.length > 0),
        hasCaption: !!evidence.caption,
      }
    }
  };

  return new Response(JSON.stringify(enrichedResponse), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    const body: VideoProcessingRequest = await req.json();
    const { jobId, sourceType, sourceUrl, sourcePlatform, filePath } = body;

    if (!jobId) {
      return new Response(JSON.stringify({ error: "jobId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update job status to processing
    await supabaseClient
      .from("video_extraction_jobs")
      .update({ 
        status: "processing",
        current_stage: "Starting video processing...",
        progress_percent: 5,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    let evidence: VideoEvidence;

    try {
      switch (sourceType) {
        case "url":
          if (sourcePlatform === "youtube") {
            evidence = await processYouTubeVideo(jobId, sourceUrl!, supabaseClient);
          } else {
            evidence = await processDirectVideoUrl(jobId, sourceUrl!, supabaseClient);
          }
          break;
        case "upload":
          if (!filePath) throw new Error("filePath required for upload sourceType");
          evidence = await processUploadedVideo(jobId, filePath, supabaseClient);
          break;
        case "image":
          if (!filePath) throw new Error("filePath required for image sourceType");
          evidence = await processUploadedImage(jobId, filePath, supabaseClient);
          break;
        default:
          throw new Error(`Unknown sourceType: ${sourceType}`);
      }

      // Update job with extracted evidence
      await supabaseClient
        .from("video_extraction_jobs")
        .update({ 
          extraction_data: evidence,
          status: "validating",
          current_stage: "Validating extraction...",
          progress_percent: 85,
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);

      // Call AI extraction
      return await callAIExtraction(jobId, evidence, sourceType, sourceUrl, sourcePlatform);

    } catch (processingError) {
      // Update job as failed
      await supabaseClient
        .from("video_extraction_jobs")
        .update({ 
          status: "failed",
          error_message: processingError instanceof Error ? processingError.message : "Processing failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);
      
      throw processingError;
    }

  } catch (error) {
    console.error("Video processing error:", error);
    return new Response(JSON.stringify({ 
      error: "Video processing failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});