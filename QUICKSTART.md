# Firebase Integration - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js / Bun installed
- Firebase project created
- `.env.local` configured with Firebase credentials

### Step 1: Install Dependencies
```bash
cd d:\vscode\project-bloom
bun install
```

### Step 2: Configure Firebase
Edit `.env.local` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Start Development Server
```bash
bun run dev
```

Open http://localhost:5173 in your browser.

### Step 4: Create Test Accounts

**Option A: Create Manually in Firebase Console**

1. Go to Firebase Console → Authentication
2. Create these users:
   - `admin@test.com` / `password123`
   - `supervisor@test.com` / `password123`
   - `student@test.com` / `password123`

3. For each user, create a document in Firestore `users` collection with the user's UID:
```json
{
  "email": "admin@test.com",
  "displayName": "Admin User",
  "role": "admin",
  "createdAt": "2026-03-26T00:00:00.000Z"
}
```

**Option B: Use Browser Console**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Copy and paste this:
```javascript
import { seedTestAccountsOnly } from './src/utils/seedDatabase.ts';
await seedTestAccountsOnly();
```

4. Or run in app initialization (add to App.tsx):
```typescript
import { seedTestAccounts } from '@/services/authService';

useEffect(() => {
  seedTestAccounts().catch(console.error);
}, []);
```

### Step 5: Login and Test

Click the demo buttons on the login page:
- 🔵 Admin Demo
- 🟣 Supervisor Demo  
- 🔴 Student Demo

## 📋 Common Tasks

### Create a Project Programmatically
```typescript
import { createProject } from '@/services/projectService';

const projectId = await createProject({
  studentId: 'student_uid',
  supervisorId: 'supervisor_uid',
  title: 'My Project',
  description: 'Project description',
  category: 'Web Development',
  status: 'pending',
  githubUrl: 'https://github.com/user/repo',
  totalCommits: 0,
  lastCommitMessage: '',
  lastCommitDate: '',
  languagesUsed: [],
  weeklyCommits: Array(8).fill(0),
  submittedDate: new Date().toISOString(),
});
```

### Upload a Submission
```typescript
import { createSubmission } from '@/services/submissionService';

const submissionId = await createSubmission(
  {
    studentId: 'student_uid',
    projectId: 'project_id',
    documentType: 'Proposal',
    title: 'Project Proposal',
    uploadDate: new Date().toISOString(),
    status: 'pending_review',
  },
  file // File object from input
);
```

### Subscribe to Real-time Notifications
```typescript
import { subscribeToUserNotifications } from '@/services/notificationService';

useEffect(() => {
  const unsubscribe = subscribeToUserNotifications(userId, (notifications) => {
    console.log('Notifications updated:', notifications);
  });

  // Cleanup on unmount
  return unsubscribe;
}, [userId]);
```

### Check User Role
```typescript
import { useAuth, useHasRole } from '@/hooks/useAuth';

function MyComponent() {
  const { role, userProfile } = useAuth();
  const isStudent = useHasRole('student');

  return <div>User role: {role}</div>;
}
```

### Protect a Route
```typescript
import { RoleBasedRoute } from '@/components/ProtectedRoute';

<Route
  path="/admin/dashboard"
  element={
    <RoleBasedRoute requiredRoles={['admin']}>
      <AdminDashboard />
    </RoleBasedRoute>
  }
/>
```

## 🔧 Troubleshooting

### Login page shows blank
- Check `.env.local` is configured correctly
- Restart dev server: `bun run dev`
- Clear browser cache (Ctrl+Shift+Delete)

### "Authentication required" error
- Verify Firestore Authentication is enabled
- Check that test accounts exist in Firebase Console
- Verify user profile documents exist in Firestore

### Real-time updates not working
- Ensure Firestore Database is enabled
- Check Firestore security rules allow reading the data
- Check browser console for errors (F12)

### File upload fails
- Verify Cloud Storage is enabled
- Check Cloud Storage rules allow authenticated uploads
- Ensure file size is within limits

### "Cannot find module" errors
- Run `bun install` again
- Delete `node_modules` and `.next` folders, reinstall
- Restart dev server

## 📚 File Organization

```
src/
├── services/          # Firebase operations
├── contexts/          # State management
├── hooks/             # React hooks
├── components/        # UI components
├── pages/             # Page components
└── utils/             # Utilities (seeding, etc)
```

## 🔐 Security Reminders

- ✅ Never commit `.env.local` with real credentials
- ✅ Use environment-specific configs in deployment
- ✅ Enable Firestore security rules before production
- ✅ Validate all data on both client and server
- ✅ Use HTTPS only in production

## 📊 Database Schema

See `IMPLEMENTATION_SUMMARY.md` for complete data models.

## 🆘 Need Help?

1. Check `FIREBASE_SETUP.md` for detailed setup
2. Review `IMPLEMENTATION_SUMMARY.md` for complete API reference
3. Check browser console for error messages (F12)
4. Review Firestore security rules in Firebase Console

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Cloud Storage enabled
- [ ] `.env.local` configured
- [ ] Test accounts created
- [ ] Able to login with test account
- [ ] Dashboard displays user information
- [ ] Role-based navigation works
- [ ] Real-time notifications appear in top navbar

---

**Ready to build?** Start the dev server: `bun run dev`
