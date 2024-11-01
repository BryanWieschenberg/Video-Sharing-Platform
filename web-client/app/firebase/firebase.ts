// Import the functions we need from the SDKs we need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User
} from "firebase/auth";

// The web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0DOQLQMlGaxlRQDgOl9iFXq245NWDMSo",
  authDomain: "video-processing-service-c3494.firebaseapp.com",
  projectId: "video-processing-service-c3494",
  appId: "1:464021412586:web:303965aad1ba1f697d1593",
  measurementId: "G-42K8YX54P9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") { // Ensure this runs only on the client side
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
const auth = getAuth(app);

/**
 * Signs the user in with a Google popup.
 * @returns {Promise<User>} A promise that resolves w/ the user's credentials.
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out.
 * @returns {Promise<User>} A promise that resolves when the user signs out.
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Triggers a callback when the user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}
