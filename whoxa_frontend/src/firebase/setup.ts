import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBedUTU-2ccff0sCBnLKGSNBGCCCrW66Ys",
    authDomain: "whoxa-b5dca.firebaseapp.com",
    projectId: "whoxa-b5dca",
    storageBucket: "whoxa-b5dca.firebasestorage.app",
    messagingSenderId: "621355185461",
    appId: "1:621355185461:web:4d8cbe66e7ea509615087c"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Function to set up reCAPTCHA
export const setupRecaptcha = (id: string) => {
  return new RecaptchaVerifier(auth, id, {
    size: "invisible", // or 'normal' if you want a visible widget
    callback: (response: any) => {
      console.log("reCAPTCHA resolved");
    },
  });
};
