# Supabase Storage Integration Summary

## Changes Made

### 1. Package Installation ✅
- Added `@supabase/supabase-js` to project dependencies
- Run: `bun add @supabase/supabase-js`

### 2. New Service: `src/services/supabase.ts` ✅
Created a new Supabase service with:

#### Exports:
- **`supabase`**: Initialized Supabase client
- **`uploadFile(file: File, studentId: string): Promise<string>`**
  - Uploads files to Supabase Storage bucket named "submissions"
  - File path: `submissions/{studentId}/{timestamp}_{filename}`
  - Returns the public URL of the uploaded file
  - Includes error handling with meaningful messages

- **`deleteFile(url: string): Promise<void>`**
  - Deletes files from Supabase Storage using the public URL
  - Extracts file path from URL and removes it from storage
  - Includes error handling

### 3. Updated: `src/services/submissionService.ts` ✅
Replaced Firebase Storage with Supabase Storage:

**Removed imports:**
- `import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'`
- Removed `storage` from firebase.ts imports

**Added imports:**
- `import { uploadFile } from './supabase'`

**Updated `createSubmission()` function:**
- Now calls `uploadFile(file, data.studentId)` instead of Firebase Storage operations
- Stores the returned URL as `fileUrl` in Firestore document
- Also stores `fileName` from the uploaded file
- Document structure remains unchanged

**Firestore Document Structure:**
```typescript
{
  studentId,
  projectId,
  documentType,
  title,
  fileUrl: "https://..." (Supabase public URL),
  fileName: "original_filename",
  uploadDate,
  status: "pending_review",
  createdAt,
  updatedAt
}
```

### 4. Updated: `.env.local` ✅
Added Supabase configuration variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** Replace with your actual Supabase project URL and anonymous key from your Supabase dashboard.

### 5. Firebase Configuration: `src/services/firebase.ts` ⚠️
Note: The `storage` export is still in firebase.ts but is no longer imported/used. It can be removed if no other code depends on it:
```typescript
export const storage = getStorage(app); // Can be removed
```

## How to Set Up Supabase

1. **Create a Supabase Project:**
   - Go to https://supabase.com
   - Create a new project
   - Wait for it to initialize

2. **Create Storage Bucket:**
   - In your Supabase dashboard, go to Storage
   - Create a new bucket named `submissions`
   - Set it to **Public** so files are readable without auth

3. **Get Configuration:**
   - In Supabase dashboard, go to Settings > API
   - Copy your Project URL and Anon Key
   - Add them to `.env.local`:
     ```
     VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

4. **Set Storage Policies (Optional):**
   - In Supabase Storage > Policies for "submissions" bucket:
   - Allow authenticated users to upload files
   - Allow public read access to files

## Testing

To test file uploads:
1. Start the dev server: `bun run dev`
2. Navigate to Submissions page
3. Upload a file
4. The file should be uploaded to Supabase Storage
5. File URL should be stored in Firestore

## Benefits of This Approach

✅ **Separation of Concerns:**
- Firebase handles authentication and data (Firestore)
- Supabase handles file storage
- Each service does what it's best at

✅ **Flexibility:**
- Can easily swap Storage providers later
- All storage logic is in one place (`supabase.ts`)

✅ **Cost Efficiency:**
- Firebase Storage tier may not be needed
- Supabase Storage pricing may be more cost-effective

✅ **Better File Management:**
- Organized file structure with student IDs
- Timestamp-based naming prevents collisions
- Public URLs work without additional auth

## Notes

- All Firestore operations remain unchanged (using Firebase Auth + Firestore)
- Only file storage moved to Supabase
- The `submissionService.ts` is the only service that touches storage
- No component changes needed; they work transparently
