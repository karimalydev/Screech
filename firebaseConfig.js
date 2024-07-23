import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCqz7cujIybCm-d5cUXF73QCvrWDDkRYXA",
  authDomain: "screech-3d6a0.firebaseapp.com",
  projectId: "screech-3d6a0",
  storageBucket: "screech-3d6a0.appspot.com",
  messagingSenderId: "170275908941",
  appId: "1:170275908941:web:3c3a3ac47a7671dc355b04",
  measurementId: "G-N6JHB68L4Q",
};

// Ensure the app is only initialized once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, firebaseConfig };
