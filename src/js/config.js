const firebaseConfig = {
  apiKey: "AIzaSyD9LTH02XKh1CshINKNqXN8Ve2Y33F9uVA",
  authDomain: "qualrole-2305.firebaseapp.com",
  databaseURL: "https://qualrole-2305.firebaseio.com",
  projectId: "qualrole-2305",
  storageBucket: "qualrole-2305.appspot.com",
  messagingSenderId: "842685281158",
  appId: "1:842685281158:web:4f3ce890c3f5a456"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//inicializa cloudStorage
const db = firebase.firestore();
 //inicializa auth
const auth = firebase.auth();

