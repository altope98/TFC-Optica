importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCpodxaWgqwls4795dWt3ZbqGEm9Ltt6fY",
    authDomain: "proyecto-consulta-firebase.firebaseapp.com",
    databaseURL: "https://proyecto-consulta-firebase.firebaseio.com",
    projectId: "proyecto-consulta-firebase",
    storageBucket: "proyecto-consulta-firebase.appspot.com",
    messagingSenderId: "1072801915077",
    appId: "1:1072801915077:web:3ea752b2a8a7839bb150ac"
  });
  
const messaging= firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log(' Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });