import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCOawF2eNogqCuaFj92dhEuauIsDB8kz-Y",
  authDomain: "livechat-vercel.firebaseapp.com",
  projectId: "livechat-vercel",
  storageBucket: "livechat-vercel.appspot.com",
  messagingSenderId: "771391162106",
  appId: "1:771391162106:web:07552734bb4ef7c66e2b43"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
