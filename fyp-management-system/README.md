# FYP Management System

This project is a FYP (Final Year Project) Management System built with React, Vite, and Tailwind CSS. It provides a user-friendly interface for managing projects, submissions, feedback, and standup meetings.

## Features

- User authentication with role-based access (Admin, Supervisor, Student)
- Project management (CRUD operations)
- Submission management
- Feedback system for submissions
- Real-time notifications
- Daily standup meeting management
- Responsive design using Tailwind CSS

## Technologies Used

- React
- Vite
- Tailwind CSS
- Firebase (Firestore, Auth, Storage)
- TypeScript

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fyp-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore, Authentication, and Storage.
   - Add your Firebase configuration to the `.env.local` file:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Seed test accounts in Firebase:**
   - Admin: admin@test.com / password123
   - Supervisor: supervisor@test.com / password123
   - Student: student@test.com / password123

5. **Run the application:**
   ```bash
   npm run dev
   ```

## Usage

- Navigate to the login page to authenticate.
- Depending on your role, access different features of the application:
  - Admin: Manage users and oversee all projects.
  - Supervisor: Review submissions and provide feedback.
  - Student: Submit projects and view feedback.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.