import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDOB1CB5TA4JX1M-jCpjhycBPu4-tScG9o",
    authDomain: "walk-through-brazil.firebaseapp.com",
    projectId: "walk-through-brazil",
    storageBucket: "walk-through-brazil.firebasestorage.app",
    messagingSenderId: "269513868235",
    appId: "1:269513868235:web:905279a475abeabd54ec4e",
    measurementId: "G-G6SP24021B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (import.meta.env.DEV) {
    // Connect to emulators if running locally
    // Only run in development
    try {
        // Dynamically import to avoid issues in production
        const { connectAuthEmulator } = await import('firebase/auth');
        const { connectFirestoreEmulator } = await import('firebase/firestore');
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
        // Optionally, log to confirm
        console.log('Connected to Firebase emulators');
    } catch (e) {
        console.warn('Could not connect to Firebase emulators:', e);
    }
} 