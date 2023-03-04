import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDVHN6pcKkjnGVuU5QryOvzvNUOILGpGW4",
  authDomain: "talkbox-cdfbf.firebaseapp.com",
  projectId: "talkbox-cdfbf",
  storageBucket: "talkbox-cdfbf.appspot.com",
  messagingSenderId: "690146912720",
  appId: "1:690146912720:web:583aed34308365e32071d5"
};

export const app = initializeApp(firebaseConfig);