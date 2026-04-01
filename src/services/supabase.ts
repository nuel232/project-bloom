import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configuration is incomplete. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param studentId - The student ID for organizing files in storage
 * @returns Promise with the public URL of the uploaded file
 */
export const uploadFile = async (file: File, studentId: string): Promise<string> => {
  try {
    // Create file path: submissions/{studentId}/{timestamp}_{filename}
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `submissions/${studentId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('submissions')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('submissions')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    throw new Error(`Failed to upload file: ${(error as Error).message}`);
  }
};

/**
 * Delete a file from Supabase Storage
 * @param url - The public URL of the file to delete
 */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Extract file path from URL
    // Format: https://{project}.supabase.co/storage/v1/object/public/submissions/{path}
    const urlParts = url.split('/submissions/');
    if (urlParts.length < 2) {
      throw new Error('Invalid file URL format');
    }

    const filePath = `submissions/${urlParts[1]}`;

    const { error } = await supabase.storage
      .from('submissions')
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`Failed to delete file: ${(error as Error).message}`);
  }
};
