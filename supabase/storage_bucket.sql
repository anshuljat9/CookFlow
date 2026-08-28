-- Storage bucket for video/image uploads
-- Run this in Supabase SQL Editor or use Supabase Dashboard -> Storage

-- Create bucket for video uploads (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'video-uploads',
  'video-uploads',
  false, -- Private bucket
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v', 'image/jpeg', 'image/png', 'image/webp'];

-- RLS policies for video-uploads bucket
-- Users can upload their own files
CREATE POLICY "Users can upload video files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'video-uploads' 
    AND (auth.uid() = owner OR owner IS NULL)
  );

-- Users can read their own uploaded files
CREATE POLICY "Users can read own video files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'video-uploads' 
    AND (auth.uid() = owner OR owner IS NULL)
  );

-- Users can delete their own uploaded files
CREATE POLICY "Users can delete own video files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'video-uploads' 
    AND (auth.uid() = owner OR owner IS NULL)
  );

-- Service role can access all files (for edge functions)
CREATE POLICY "Service role can access all video files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'video-uploads'
    AND auth.role() = 'service_role'
  );