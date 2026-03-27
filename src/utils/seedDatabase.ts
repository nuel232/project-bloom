import { seedTestAccounts } from '@/services/authService';
import { createProject } from '@/services/projectService';
import { createSubmission } from '@/services/submissionService';
import { createStandup } from '@/services/standupService';
import { createFeedback } from '@/services/feedbackService';
import { createNotification } from '@/services/notificationService';
import { db } from '@/services/firebase';
import { getDocs, collection, deleteDoc } from 'firebase/firestore';

/**
 * Seed the entire database with test data
 */
export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Seed test accounts
    console.log('📝 Creating test accounts...');
    await seedTestAccounts();
    console.log('✅ Test accounts created');

    // Get the UIDs from Firebase Auth (you'll need to get these manually or from Firebase console)
    // For now, we'll use mock IDs that should be replaced with real Firebase UIDs

    const studentUid = 'student_uid_placeholder'; // Replace with real UID from Firebase
    const supervisorUid = 'supervisor_uid_placeholder'; // Replace with real UID from Firebase
    const adminUid = 'admin_uid_placeholder'; // Replace with real UID from Firebase

    // 2. Seed projects
    console.log('📚 Creating sample projects...');
    const project1 = await createProject({
      studentId: studentUid,
      supervisorId: supervisorUid,
      title: 'Blockchain Voting System',
      description: 'A decentralized voting system built on Ethereum blockchain',
      category: 'Blockchain',
      status: 'approved',
      githubUrl: 'https://github.com/student/blockchain-voting',
      totalCommits: 47,
      lastCommitMessage: 'feat: add vote tallying smart contract',
      lastCommitDate: '2025-03-23',
      languagesUsed: [
        { name: 'JavaScript', percentage: 60, color: 'hsl(270 100% 80%)' },
        { name: 'CSS', percentage: 20, color: 'hsl(217 91% 60%)' },
        { name: 'HTML', percentage: 20, color: 'hsl(0 0% 55%)' },
      ],
      weeklyCommits: [3, 5, 8, 2, 7, 4, 6, 12],
      submittedDate: '2025-02-15',
    });
    console.log('✅ Created project:', project1);

    // 3. Seed submissions
    console.log('📄 Creating sample submissions...');
    const submission1 = await createSubmission({
      studentId: studentUid,
      projectId: project1,
      documentType: 'Proposal',
      title: 'Blockchain Voting System Proposal',
      uploadDate: '2025-02-15',
      status: 'reviewed',
      feedback: 'Well-structured proposal. Approved.',
      feedbackDate: '2025-02-18',
      feedbackBy: supervisorUid,
    });
    console.log('✅ Created submission:', submission1);

    // 4. Seed standups
    console.log('🎯 Creating sample standups...');
    const standup1 = await createStandup({
      studentId: studentUid,
      weekNumber: 6,
      date: '2025-03-21',
      workedOn: 'Implemented vote tallying smart contract and unit tests',
      nextWeek: 'Start frontend integration with Web3.js',
      blockers: 'None',
    });
    console.log('✅ Created standup:', standup1);

    // 5. Seed feedback
    console.log('💬 Creating sample feedback...');
    const feedback1 = await createFeedback({
      studentId: studentUid,
      submissionId: submission1,
      supervisorId: supervisorUid,
      comment: 'Well-structured proposal. Good technical approach.',
      date: '2025-02-18',
      read: false,
    });
    console.log('✅ Created feedback:', feedback1);

    // 6. Seed notifications
    console.log('🔔 Creating sample notifications...');
    const notification1 = await createNotification({
      userId: studentUid,
      role: 'student',
      message: 'Your proposal has been approved',
      date: '2025-02-18',
      read: false,
      type: 'proposal',
    });
    console.log('✅ Created notification:', notification1);

    console.log('✅ Database seeding complete!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
}

/**
 * Alternative: Seed only test accounts
 */
export async function seedTestAccountsOnly() {
  console.log('🌱 Creating test accounts...');
  try {
    await seedTestAccounts();
    console.log('✅ Test accounts created successfully');
    console.log('You can now login with:');
    console.log('  - admin@test.com / password123');
    console.log('  - supervisor@test.com / password123');
    console.log('  - student@test.com / password123');
    return true;
  } catch (error) {
    console.error('❌ Error creating test accounts:', error);
    return false;
  }
}

/**
 * Clear all data from a collection (use with caution!)
 */
export async function clearCollection(collectionName: string) {
  const confirmed = window.confirm(
    `⚠️ Are you sure you want to delete all documents in "${collectionName}"? This cannot be undone!`
  );

  if (!confirmed) {
    console.log('❌ Operation cancelled');
    return false;
  }

  try {
    const querySnapshot = await getDocs(collection(db, collectionName));

    for (const doc of querySnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    console.log(`✅ Cleared ${querySnapshot.size} documents from ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error clearing ${collectionName}:`, error);
    return false;
  }
}

// Export for use in browser console
declare global {
  interface Window {
    seedDatabase?: typeof seedDatabase;
    seedTestAccountsOnly?: typeof seedTestAccountsOnly;
    clearCollection?: typeof clearCollection;
  }
}

if (typeof window !== 'undefined') {
  window.seedDatabase = seedDatabase;
  window.seedTestAccountsOnly = seedTestAccountsOnly;
  window.clearCollection = clearCollection;
}

export default seedDatabase;
