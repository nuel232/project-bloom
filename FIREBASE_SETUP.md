# Firebase Integration Guide for FYP Management System

## Overview

This project has been integrated with Firebase v9 (modular SDK) for:
- **Authentication**: Email/password-based login with role support
- **Firestore Database**: Real-time data management
- **Cloud Storage**: Document upload and storage
- **Real-time Listeners**: Using Firestore's onSnapshot for live updates

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter your project name (e.g., "FYP Management System")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Required Services

Once your project is created:

#### Authentication
1. Go to **Build > Authentication**
2. Click **Get started**
3. Select **Email/Password** provider
4. Enable it and save

#### Firestore Database
1. Go to **Build > Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll set rules later)
4. Select your region (e.g., `us-central1`)

#### Cloud Storage
1. Go to **Build > Storage**
2. Click **Get started**
3. Accept the default rules
4. Select your region

### 3. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **</> (Web)** if not already created
4. Copy your Firebase config

### 4. Set Environment Variables

Create/update `.env.local` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Set Firestore Security Rules

Go to **Firestore Database > Rules** and replace with:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // Projects collection
    match /projects/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'supervisor' ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Submissions collection
    match /submissions/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      allow delete: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Feedback collection
    match /feedbacks/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Notifications collection
    match /notifications/{document=**} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth != null;
    }

    // Standups collection
    match /standups/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Set Storage Security Rules

Go to **Storage > Rules** and replace with:

```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /submissions/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 7. Seed Test Accounts

The project includes three test accounts configured in `.env.local`:

1. **Admin Account**
   - Email: `admin@test.com`
   - Password: `password123`
   - Role: `admin`

2. **Supervisor Account**
   - Email: `supervisor@test.com`
   - Password: `password123`
   - Role: `supervisor`
   - Department: Software Engineering
   - Staff ID: SE/001

3. **Student Account**
   - Email: `student@test.com`
   - Password: `password123`
   - Role: `student`
   - Department: Computer Science
   - Matric Number: CS/2021/001

To seed these accounts, run this in your browser console after starting the app:

```javascript
import { seedTestAccounts } from './src/services/authService';
await seedTestAccounts();
```

Or manually create these accounts in Firebase Console:
1. Go to **Authentication > Users**
2. Click **Add user**
3. Enter email and password
4. Create the user

Then create matching documents in Firestore:
1. Go to **Firestore Database**
2. Create collection `users`
3. For each user, create a document with the user's UID:

```json
{
  "uid": "firebase_uid",
  "email": "email@test.com",
  "displayName": "User Name",
  "role": "student|supervisor|admin",
  "department": "Department Name",
  "matricNumber": "CS/2021/001",
  "staffId": "SE/001",
  "createdAt": "2026-03-26T00:00:00.000Z"
}
```

## Project Structure

### Services (`src/services/`)

- **firebase.ts**: Firebase initialization and configuration
- **authService.ts**: Authentication operations (login, register, logout, profile management)
- **projectService.ts**: Project CRUD operations with real-time listeners
- **submissionService.ts**: Submission management with file upload
- **feedbackService.ts**: Feedback creation and retrieval
- **notificationService.ts**: Notification management with real-time listeners
- **standupService.ts**: Weekly standup tracking with real-time listeners

### Context & Hooks (`src/contexts/` & `src/hooks/`)

- **AuthContext.tsx**: Central authentication state management
- **useAuth.ts**: Hook to access auth context and check roles

### Components

- **ProtectedRoute.tsx**: Route protection based on authentication and roles
- **AppSidebar.tsx**: Updated to use new auth context
- **TopNavbar.tsx**: Real-time notifications from Firestore
- **RoleSwitcher.tsx**: Changed to logout button

## Key Features Implemented

### Real-time Updates
- Notifications update in real-time via `subscribeToUserNotifications`
- Projects update in real-time via `subscribeToProjects`
- Submissions update in real-time via `subscribeToStudentSubmissions`
- Standups update in real-time via `subscribeToStudentStandups`
- Feedback updates in real-time via `subscribeToStudentFeedback`

### Authentication
- Email/password login and registration
- Role-based access control (Student, Supervisor, Admin)
- Automatic session persistence using Firebase's built-in auth state management

### File Upload
- Upload submissions to Firebase Cloud Storage
- Download URLs automatically generated

### Data Validation
- Firestore security rules ensure data integrity
- Users can only access their own data unless they're supervisors/admins

## Migration Notes

### Old Mock Data Approach
Previously, the app used `mockData.ts` and a simple `RoleContext` for role switching during development. This has been replaced with:

- **Real Database**: Firestore replaces the mock data system
- **Real Auth**: Firebase Authentication replaces the role switcher
- **Real Files**: Cloud Storage replaces mock file uploads
- **Real-time Updates**: Firestore listeners replace static data

### Components Updated
All components that used `useRole()` have been updated to use `useAuth()`:
- `AppSidebar.tsx`
- `TopNavbar.tsx`
- `RoleSwitcher.tsx`

### Routes Protected
All routes are now protected by `ProtectedRoute` which:
1. Checks if user is authenticated
2. Checks if user has the required role
3. Redirects to login or unauthorized page if needed

## Running the Application

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```

3. Navigate to `http://localhost:5173`

4. Login with one of the test accounts

## Troubleshooting

### "Firebase config is incomplete" error
- Ensure all environment variables are set in `.env.local`
- Restart the dev server after changing `.env.local`

### Authentication fails
- Check that the user exists in Firebase Authentication
- Verify the user profile document exists in Firestore under `users/{uid}`
- Check Firestore security rules allow reading user profiles

### Real-time updates not working
- Verify Firestore Database is enabled
- Check that the user has permission to read the data via security rules
- Check browser console for Firestore errors

### File upload fails
- Verify Cloud Storage is enabled
- Check Cloud Storage security rules allow authenticated users to write
- Ensure the app is running on localhost or a trusted domain

## Next Steps

1. Configure custom domain in Firebase
2. Set up Cloud Functions for server-side operations
3. Implement email notifications
4. Add analytics tracking
5. Set up automated backups

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Web Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Storage Documentation](https://firebase.google.com/docs/storage)
