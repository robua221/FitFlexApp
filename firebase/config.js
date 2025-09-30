import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBE4TeATdLXMc2yyxr0MeoV2YWttw5NYmc",
  authDomain: "fitflex-b8ab2.firebaseapp.com",
  projectId: "fitflex-b8ab2",
  storageBucket: "fitflex-b8ab2.firebasestorage.app",
  messagingSenderId: "892811387550",
  appId: "1:892811387550:web:be1b3bd51df03ffc0d918f"
};
const app = initializeApp(firebaseConfig);

const GOOGLE_PLACES_API_KEY = "AIzaSyBSSAAo7L0ZngxlI291ihg1jo46x5kk6BI";
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db,GOOGLE_PLACES_API_KEY };