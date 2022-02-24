
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyDFGIEq10EP7P-sShr2pYu929gyd7cTF5M",
    authDomain: "its-up-there.firebaseapp.com",
    projectId: "its-up-there",
    storageBucket: "its-up-there.appspot.com",
    messagingSenderId: "412955734815",
    appId: "1:412955734815:web:1c821c1f59766ab808b62a"
  };
  
  
  
   const app =initializeApp(firebaseConfig);
  const db = getFirestore(app);
  export {db}  