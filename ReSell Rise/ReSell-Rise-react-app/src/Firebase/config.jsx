import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "olx-2-2fda1.firebaseapp.com",
  databaseURL: "https://olx-2-2fda1-default-rtdb.firebaseio.com",
  projectId: "olx-2-2fda1",
  storageBucket: "olx-2-2fda1.appspot.com",
  messagingSenderId: "797631378728",
  appId: "1:797631378728:web:086877133798c7ade24c1d"
};
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
