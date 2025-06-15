
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAigmjqOg80WNX1flSb1DAH2KuuMO8AqKU",
  authDomain: "at41rv-img.firebaseapp.com",
  projectId: "at41rv-img",
  storageBucket: "at41rv-img.appspot.com",
  messagingSenderId: "649053094342",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
