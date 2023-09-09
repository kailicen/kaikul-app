
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {format, addYears} from "date-fns";
import nodemailer from "nodemailer";

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

exports.updateBuddyLists = functions.firestore
  .document("buddyRequests/{requestId}")
  .onUpdate(async (change) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (newValue.status === "accepted" && previousValue.status === "pending") {
      const {fromUserId, toUserId} = newValue;

      const usersRef = admin.firestore().collection("users");

      await Promise.all([
        usersRef.doc(fromUserId).update({
          buddies: admin.firestore.FieldValue.arrayUnion(toUserId),
        }),
        usersRef.doc(toUserId).update({
          buddies: admin.firestore.FieldValue.arrayUnion(fromUserId),
        }),
      ]);
    }
  });

exports.createGoalOnProfileAddition = functions.firestore
  .document("userProfiles/{profileId}")
  .onCreate(async (snap, _context) => {
    // Get the data from the newly created profile
    const userProfile = snap.data();

    if (userProfile && userProfile.biggestGoal) {
      const currentDate = new Date();
      const startDate = format(currentDate, "yyyy-MM-dd");
      const endDate = format(addYears(currentDate, 1), "yyyy-MM-dd");

      const goal = {
        text: userProfile.biggestGoal,
        startDate: startDate,
        endDate: endDate,
        completed: false,
        description: "",
        userId: userProfile.userId,
        color: "#B795EC",
        // If you want to include tasks, you can do so here
      };

      // Now, add this to the weeklyGoals collection
      try {
        await admin.firestore().collection("weeklyGoals").add(goal);
      } catch (error) {
        console.error("Error adding weekly goal: ", error);
      }
    }
  });


exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) =>{
  const email = user.email;

  const mailTransport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "705798b37178be",
      pass: "09f34148192697",
    },
  });

  const mailOptions = {
    from: `Kaikul : no-reply@kaikul.com`,
    to: email,
    subject: "Welcome to Kaikul",
    text: `Dear ${user.displayName}, Welcome to Kaikul`
  };

  try {
    mailTransport.sendMail(mailOptions);
    console.log("Welcome Mail Sent");
  } catch (error) {
    console.error("There was an error while sending the email:", error);
  }

  return null
})