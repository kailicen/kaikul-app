const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./kaikul-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Retrieve the default Firestore instance
const firestore = admin.firestore();

const updateExistingUsers = async () => {
  try {
    const usersRef = firestore.collection("userProfiles");

    // Get all users
    const allUsersSnapshot = await usersRef.get();
    const allUsers = allUsersSnapshot.docs;

    // Update each user to include the leaderboardParticipation field
    const batch = firestore.batch();
    allUsers.forEach((user) => {
      if (user.data().leaderboardParticipation === undefined) {
        batch.update(user.ref, { leaderboardParticipation: true });
      }
    });

    // Commit the batch
    await batch.commit();

    console.log(
      "Updated all existing users to include the leaderboardParticipation field."
    );
  } catch (error) {
    console.error("Error updating users:", error);
  }
};

updateExistingUsers();
