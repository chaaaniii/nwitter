import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL:process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID, 
  };

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase; //firebase인스턴스를 소셜로그인 할 때 쓰기위해.

export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();