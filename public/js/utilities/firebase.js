// import firebase from "firebase";
const firebase = require("firebase");
require("firebase/storage");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBly1FJfCUUtB0zxUlWC1yCOdxu2kdM6lc",
  authDomain: "chessmaster-ef60e.firebaseapp.com",
  projectId: "chessmaster-ef60e",
  storageBucket: "chessmaster-ef60e.appspot.com",
  messagingSenderId: "958207309306",
  appId: "1:958207309306:web:b57d4f1f98b328af902043",
  measurementId: "G-5ZPH55RN6B",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.app().storage();
const auth = firebaseApp.auth();

module.exports = { db, storage, auth, firebase };
// export { db };
