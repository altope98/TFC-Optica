'use strict'

 var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://proyecto-consulta-firebase.firebaseio.com",
});

const messaging= admin.messaging();

module.exports= messaging; 
 

var firebase=require("firebase");

var firebaseConfig = {
  apiKey: "AIzaSyCpodxaWgqwls4795dWt3ZbqGEm9Ltt6fY",
  authDomain: "proyecto-consulta-firebase.firebaseapp.com",
  databaseURL: "https://proyecto-consulta-firebase.firebaseio.com",
  projectId: "proyecto-consulta-firebase",
  storageBucket: "proyecto-consulta-firebase.appspot.com",
  messagingSenderId: "1072801915077",
  appId: "1:1072801915077:web:3ea752b2a8a7839bb150ac"
};

const db= firebase.initializeApp(firebaseConfig).firestore();

module.exports= db; 


var app= require('./app');

const PORT = process.env.PORT || 5000// 3000
app.listen(PORT, ()=>{
  console.log('servidor corriendo en '+PORT);
});