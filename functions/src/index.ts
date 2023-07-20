import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user) => {
    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerData: user.providerData,
    };

    db.collection("users").doc(user.uid).set(newUser);
  });

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();

// exports.updateBuddyLists = functions.firestore
//   .document("buddyRequests/{requestId}")
//   .onUpdate((change, context) => {
//     const newValue = change.after.data();
//     const previousValue = change.before.data();

//     if (newValue.status === "accepted"
// && previousValue.status === "pending") {
//       const { senderId, receiverId } = newValue;

//       const usersRef = admin.firestore().collection("users");

//       return Promise.all([
//         usersRef.doc(senderId).update({
//           buddies: admin.firestore.FieldValue.arrayUnion(receiverId),
//         }),
//         usersRef.doc(receiverId).update({
//           buddies: admin.firestore.FieldValue.arrayUnion(senderId),
//         }),
//       ]);
//     } else {
//       return null;
//     }
//   });
