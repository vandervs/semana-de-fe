import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-137720829-7ae77",
  "appId": "1:515777802768:web:19cf89072b4538965e9095",
  "apiKey": "AIzaSyByEY4L3RzgZRQA8PLCUxdZIx1Pc-01LRM",
  "authDomain": "studio-137720829-7ae77.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "515777802768"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

export { db };
