import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig={
    apiKey: "AIzaSyCpodxaWgqwls4795dWt3ZbqGEm9Ltt6fY",
    authDomain: "proyecto-consulta-firebase.firebaseapp.com",
    databaseURL: "https://proyecto-consulta-firebase.firebaseio.com",
    projectId: "proyecto-consulta-firebase",
    storageBucket: "proyecto-consulta-firebase.appspot.com",
    messagingSenderId: "1072801915077",
    appId: "1:1072801915077:web:3ea752b2a8a7839bb150ac"
  };

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();