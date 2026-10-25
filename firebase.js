
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApNg9aATvxbjHRE0hu52nHEsWaDX85YOk",
  authDomain: "califnco-ee43f.firebaseapp.com",
  projectId: "califnco-ee43f",
  storageBucket: "califnco-ee43f.firebasestorage.app",
  messagingSenderId: "799512034973",
  appId: "1:799512034973:web:11b3ab6b241f18b1301e74",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
