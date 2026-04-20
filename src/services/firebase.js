import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBevdapmUOLV0w6M1r42VYZZ0rpEzYQ0IY",
  authDomain: "careerfolio-c4713.firebaseapp.com",
  projectId: "careerfolio-c4713",
  storageBucket: "careerfolio-c4713.firebasestorage.app",
  messagingSenderId: "332541321970",
  appId: "1:332541321970:web:ec2e35c5af864a73da266b"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);