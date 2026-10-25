/**
 * Earthroot Farm - Firebase Cloud Database Configuration
 * 
 * Free Tier limits on Google Firebase Firestore:
 * - 1 GB stored data (free forever)
 * - 50,000 document reads / day
 * - 20,000 document writes / day
 * 
 * You can paste your Firebase credentials below, OR enter them directly inside
 * the "Cloud Database" settings modal on the Admin Portal without editing code.
 */

window.EARTHROOT_DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

/**
 * Returns active Firebase config:
 * 1. Checks localStorage for credentials entered in the Admin UI modal
 * 2. Falls back to window.EARTHROOT_DEFAULT_FIREBASE_CONFIG above
 */
window.getEarthrootFirebaseConfig = function() {
  try {
    const saved = localStorage.getItem('earthroot_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored Firebase config:', e);
  }

  // Fallback to hardcoded config if populated
  if (window.EARTHROOT_DEFAULT_FIREBASE_CONFIG && 
      window.EARTHROOT_DEFAULT_FIREBASE_CONFIG.projectId && 
      window.EARTHROOT_DEFAULT_FIREBASE_CONFIG.apiKey) {
    return window.EARTHROOT_DEFAULT_FIREBASE_CONFIG;
  }

  return null;
};
