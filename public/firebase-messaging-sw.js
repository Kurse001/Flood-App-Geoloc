importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA4VRx2k814Z5-gBry7LafhIX0fWUgJrPE",
  authDomain: "flood-nowcasting-app.firebaseapp.com",
  projectId: "flood-nowcasting-app",
  storageBucket: "flood-nowcasting-app.firebasestorage.app",
  messagingSenderId: "670554101901",
  appId: "1:670554101901:web:38fa9073d82bf6cf946ac4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
