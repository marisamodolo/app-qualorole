const firebaseConfig = {
  apiKey: "AIzaSyB2vafCQak6cgirrOTC7ZdGseH4AOtKHlY",
  authDomain: "qualrole-650be.firebaseapp.com",
  databaseURL: "https://qualrole-650be.firebaseio.com",
  projectId: "qualrole-650be",
  storageBucket: "qualrole-650be.appspot.com",
  messagingSenderId: "513974818431",
  appId: "1:513974818431:web:ed21ab217cf71352"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//inicializa cloudStorage
 const db = firebase.firestore();
 //inicializa auth
 const auth = firebase.auth();

