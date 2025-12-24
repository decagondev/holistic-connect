/**
 * Firebase configuration for HolisticConnect
 * 
 * All configuration values are loaded from environment variables
 * to ensure security and flexibility across environments.
 * 
 * @see https://firebase.google.com/docs/web/setup#config-object
 */

import type { FirebaseOptions } from 'firebase/app';

/**
 * Firebase configuration object
 * 
 * This configuration is used to initialize the Firebase app.
 * All values must be set in environment variables (see .env.local.example).
 */
export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Validates that all required Firebase configuration values are present
 * 
 * @throws {Error} If any required configuration value is missing
 */
export function validateFirebaseConfig(): void {
  const requiredKeys: (keyof FirebaseOptions)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingKeys = requiredKeys.filter(
    (key) => !firebaseConfig[key]
  );

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required Firebase configuration: ${missingKeys.join(', ')}. ` +
      'Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set.'
    );
  }
}

