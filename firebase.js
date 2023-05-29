import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  // Your Firebase project config details
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
