const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./kaikul-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Retrieve the default Firestore instance
const firestore = admin.firestore();

const addFieldsToUsers = async () => {
  try {
    // Fetch all users
    const usersSnapshot = await firestore.collection("users").get();

    // Prepare batch
    const batch = firestore.batch();

    // Loop through users and update each document
    usersSnapshot.forEach((doc) => {
      const userRef = firestore.collection("users").doc(doc.id);

      // Generate a user-specific token (modify as needed)
      const token = `token_for_${doc.id}`;

      // Add isSubscribed and token to user
      batch.update(userRef, {
        isSubscribed: true, // default to false or true as per your requirement
        token: token,
      });
    });

    // Commit batch
    await batch.commit();
    console.log("All users updated successfully.");
  } catch (error) {
    console.error("Error updating users: ", error);
  }
};

// Run the function
addFieldsToUsers();
