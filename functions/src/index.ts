/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {format, addYears} from "date-fns";
import * as mailgun from "mailgun-js";

admin.initializeApp();
const db = admin.firestore();

const mg = mailgun({
  apiKey: functions.config().mailgun.apikey,
  domain: functions.config().mailgun.domain,
});

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

exports.updateBuddyListsAndSendMessages = functions.firestore
  .document("buddyRequests/{requestId}")
  .onUpdate(async (change) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (newValue.status === "accepted" && previousValue.status === "pending") {
      const {fromUserId, toUserId, senderReason, recipientResponse} =
        newValue;

      const usersRef = admin.firestore().collection("users");
      const messagesRef = admin.firestore().collection("messages");

      const chatId = [fromUserId, toUserId].sort().join("_");

      const senderMessage = {
        chatId: chatId,
        senderId: fromUserId,
        receiverId: toUserId,
        message: senderReason,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false,
      };

      const recipientMessage = {
        chatId: chatId,
        senderId: toUserId,
        receiverId: fromUserId,
        message: recipientResponse,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false,
        // Optionally add senderName and senderPhotoURL if needed
      };

      await Promise.all([
        usersRef.doc(fromUserId).update({
          buddies: admin.firestore.FieldValue.arrayUnion(toUserId),
        }),
        usersRef.doc(toUserId).update({
          buddies: admin.firestore.FieldValue.arrayUnion(fromUserId),
        }),
        messagesRef.add(senderMessage),
        messagesRef.add(recipientMessage),
      ]);
    }
  });

exports.createGoalOnProfileAddition = functions.firestore
  .document("userProfiles/{profileId}")
  .onCreate(async (snap) => {
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

exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const email = user.email;
  const displayName = user.displayName || user.email?.split("@")[0];

  if (!email) {
    console.error("No email provided");
    return {success: false, error: "No email provided"};
  }

  const data = {
    from: "KaiKul Team <kaili@kaikul.com>",
    to: email,
    subject: "Welcome to KaiKul",
    template: "welcome_email",
    "h:X-Mailgun-Variables": JSON.stringify({
      displayName: displayName,
    }),
  };

  try {
    await mg.messages().send(data);
    console.log("Welcome Mail Sent");
    return {success: true};
  } catch (error) {
    console.error(
      "There was an error while sending the email:",
      (error as Error).message
    );
    return {success: false, error: (error as Error).message};
  }
});

exports.sendWeeklyNewsletter = functions.pubsub
  .schedule("every day 09:00")
  .timeZone("America/Los_Angeles")
  .onRun(async (_context) => {
    try {
      // Fetch subscribers from Firebase (assuming Firestore here)
      const snapshot = await admin.firestore().collection("users").get();
      if (snapshot.empty) {
        console.log("No subscribers found.");
        return;
      }

      const recipients: string[] = [];
      snapshot.forEach((doc) => {
        const email = doc.data().email;
        if (email === "kailicen226@gmail.com") {
          // TODO: Remove test condition before deploying
          recipients.push(email);
        }
      });

      // Send emails using Mailgun
      const data = {
        from: "KaiKul Team <kaili@kaikul.com>",
        to: recipients,
        subject: "Your Weekly Newsletter",
        template: "newsletter",
      };

      const result = await mg.messages().send(data);
      console.log(result);
    } catch (error) {
      console.error("Error sending newsletter:", error);
    }
  });
