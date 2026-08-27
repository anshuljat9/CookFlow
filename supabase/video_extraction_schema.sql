-- Video Recipe Extraction Schema
-- Run this in Supabase SQL Editor after running schema.sql and substitutions_schema.sql

-- Video processing jobs table
CREATE TABLE video_extraction_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID, -- Null for anonymous sessions
  source_type TEXT CHECK (source_type IN ('url', 'upload', 'image')) NOT NULL,
  source_url TEXT,
  source_platform TEXT,
  original_filename TEXT,
  file_size_bytes BIGINT,
  video_duration_seconds INTEGER,
  status TEXT CHECK (status IN ('queued', 'processing', 'extracting_audio', 'extracting_frames', 'analyzing', 'validating', 'completed', 'failed', 'cancelled')) DEFAULT 'queued',
  current_stage TEXT,
  progress_percent INTEGER DEFAULT 0,
  error_message TEXT,
  extracted_recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  extraction_data JSONB, -- Stores transcript, frames metadata, OCR results, etc.
  ai_confidence NUMERIC(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_video_extraction_jobs_user ON video_extraction_jobs(user_id);
CREATE INDEX idx_video_extraction_jobs_status ON video_extraction_jobs(status);
CREATE INDEX idx_video_extraction_jobs_source_url ON video_extraction_jobs(source_url);
CREATE INDEX idx_video_extraction_jobs_created_at ON video_extraction_jobs(created_at DESC);

-- Enable RLS
ALTER TABLE video_extraction_jobs ENABLE ROW LEVEL SECURITY;

-- Public read policies for own jobs (or all if anonymous)
CREATE POLICY "Users can read own extraction jobs" ON video_extraction_jobs
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own extraction jobs" ON video_extraction_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own extraction jobs" ON video_extraction_jobs
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Update trigger for video_extraction_jobs
CREATE TRIGGER update_video_extraction_jobs_updated_at
  BEFORE UPDATE ON video_extraction_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_substitutions_updated_at();

-- Extend recipes table with additional fields for video extraction (if not already present)
-- These fields already exist in schema.sql:
-- source_type, source_url, source_platform, ai_generated, ai_confidence, source_creator

-- Add extraction_status to recipes for tracking
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS extraction_status TEXT CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending';
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS extraction_job_id UUID REFERENCES video_extraction_jobs(id) ON DELETE SET NULL;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS extraction_confidence_breakdown JSONB; -- Per-field confidence scores
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS extraction_evidence JSONB; -- Source attribution for ingredients/steps
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS extraction_warnings TEXT[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS extraction_uncertain_items JSONB; -- Items with low confidence