import Firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBwnWgG2gur-t-JjiMQhxRi2eiWM7Dbfj4",
    authDomain: "towers-42c7a.firebaseapp.com",
    databaseURL: "https://towers-42c7a.firebaseio.com",
    storageBucket: "towers-42c7a.appspot.com",
  };
Firebase.initializeApp(config);

export default Firebase.database();