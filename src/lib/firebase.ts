import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-137720829-7ae77",
  "appId": "1:515777802768:web:19cf89072b4538965e9095",
  "apiKey": "AIzaSyByEY4L3RzgZRQA8PLCUxdZIx1Pc-01LRM",
  "authDomain": "studio-137720829-7ae77.firebaseapp.com",
  "storageBucket": "studio-137720829-7ae77.appspot.com",
  "measurementId": "",
  "messagingSenderId": "515777802768"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { 
    db, 
    storage, 
    auth,
};
