/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {format, addYears} from "date-fns";
import * as mailgun from "mailgun-js";
// import * as cors from "cors";
// default is for Vercel deployment issue, but it will break the functions
import {default as cors} from "cors";


admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({origin: true});

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
      token: `token_for_${user.uid}`,
      isSubscribed: true,
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
    from: "KaiKul Team <kaikulteam@kaikul.com>",
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

interface Recipient {
  email: string;
  displayName: string;
  token: string;
}

exports.sendWeeklyNewsletter = functions.pubsub
  .schedule("every monday 03:40") // everyday for testing TODO: put it to every sunday etc.
  .timeZone("America/Los_Angeles")
  .onRun(async (_context) => {
    try {
      // Fetch subscribers from Firebase (assuming Firestore here)
      const snapshot = await admin
        .firestore()
        .collection("users")
        .where("isSubscribed", "==", true)
        .get();
      if (snapshot.empty) {
        console.log("No subscribers found.");
        return;
      }

      const recipients: Recipient[] = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        const email = userData.email;
        const displayName = userData.displayName; // Assuming field is 'displayName'
        const token = userData.token; // Assuming field is 'token'

        recipients.push({
          email,
          displayName,
          token,
        });
      });

      for (const recipient of recipients) {
        // Extract email domain
        const emailDomain = recipient.email.split("@")[0];

        // Use email domain as displayName if no displayName is provided
        const displayName = recipient.displayName || emailDomain;

        // Construct an unsubscribe link
        const unsubscribeLink = `https://kaikul.com/unsubscribe?token=${recipient.token}`;

        // Modify data to include displayName, domain, and unsubscribe link in the email template
        const data = {
          from: "KaiKul Team <kaikulteam@kaikul.com>",
          to: recipient.email,
          subject: "Your Weekly Newsletter", // also need to change subject
          template: "newsletter",
          "h:X-Mailgun-Variables": JSON.stringify({
            displayName: displayName,
            unsubscribeLink: unsubscribeLink,
          }),
        };

        const result = await mg.messages().send(data);
        console.log(result);
      }
    } catch (error) {
      console.error("Error sending newsletter:", error);
    }
  });

exports.unsubscribeUser = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // Ensure you're using POST for better security
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // Get the token from the request body
    const {token} = req.body;

    if (!token) {
      res.status(400).send("Bad Request: Token is required");
      return;
    }

    try {
      const userSnapshot = await db
        .collection("users")
        .where("token", "==", token)
        .get();

      if (userSnapshot.empty) {
        res.status(404).send("User not found");
        return;
      }

      // Update all matching documents
      const batch = db.batch();
      let userId = null; // Initialize userId

      userSnapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, {
          isSubscribed: false,
          token: null,
        });
        // Retrieve the user id
        userId = docSnap.id;
      });
      await batch.commit();

      // Sending userId in the response
      res
        .status(200)
        .json({message: "User unsubscribed successfully", userId});
    } catch (error) {
      console.error("Error unsubscribing user: ", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
