const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./kaikul-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Retrieve the default Firestore instance
const firestore = admin.firestore();

const migrateUsers = async () => {
  // Retrieve all existing users from Firebase Authentication
  const userRecords = await admin.auth().listUsers();

  // Loop through each user and migrate to the "users" collection
  for (const userRecord of userRecords.users) {
    const { uid, displayName, email, photoURL } = userRecord.toJSON();

    // Check if the user already exists in the "users" collection
    const userDocRef = firestore.collection("users").doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // If the user doesn't exist, migrate them to the "users" collection
      const userData = {
        displayName: displayName || null,
        email,
        photoURL: photoURL || null,
      };

      // Create a new document in the "users" collection
      await userDocRef.set(userData);
      console.log(`User with UID ${uid} migrated successfully.`);
    } else {
      console.log(
        `User with UID ${uid} already exists in the 'users' collection.`
      );
    }
  }

  console.log("Migration completed successfully.");
};

migrateUsers();
