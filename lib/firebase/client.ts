/**
 * Firebase client-side initialization
 * 
 * This module initializes the Firebase app and exports instances
 * for Authentication and Firestore services.
 * 
 * Uses the getApp/getApps pattern to prevent multiple initializations
 * which is important in Next.js with hot module reloading.
 * 
 * @see https://firebase.google.com/docs/web/setup#initialize-sdk
 */

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, validateFirebaseConfig } from './config';

/**
 * Initialize Firebase app
 * 
 * Uses getApp/getApps pattern to ensure only one instance is created,
 * even with Next.js hot module reloading.
 */
function initializeFirebaseApp() {
  // Validate configuration before initializing
  validateFirebaseConfig();

  // Return existing app if already initialized
  if (getApps().length > 0) {
    return getApp();
  }

  // Initialize new app instance
  return initializeApp(firebaseConfig);
}

// Initialize Firebase app
const app = initializeFirebaseApp();

/**
 * Firebase Authentication instance
 * 
 * Use this for all authentication operations (sign in, sign up, etc.)
 */
export const auth = getAuth(app);

/**
 * Firestore database instance
 * 
 * Use this for all database operations (read, write, queries, etc.)
 */
export const db = getFirestore(app);

/**
 * Firebase app instance
 * 
 * Exported for advanced use cases or multiple app scenarios
 */
export { app };

