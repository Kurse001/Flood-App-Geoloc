import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseApp = initializeApp({ apiKey: "AIzaSyA4VRx2k814Z5-gBry7LafhIX0fWUgJrPE",
  authDomain: "flood-nowcasting-app.firebaseapp.com",
  projectId: "flood-nowcasting-app",
  storageBucket: "flood-nowcasting-app.firebasestorage.app",
  messagingSenderId: "670554101901",
  appId: "1:670554101901:web:38fa9073d82bf6cf946ac4" });
export const messaging = getMessaging(firebaseApp);
