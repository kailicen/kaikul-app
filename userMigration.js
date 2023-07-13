const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./kaikul-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Retrieve the default Firestore instance
const firestore = admin.firestore();

const migrateUsers = async () => {
  const usersSnapshot = await firestore.collection("users").get();

  // Check if the "users" collection is empty
  if (usersSnapshot.empty) {
    // Retrieve all existing users from Firebase Authentication
    const userRecords = await admin.auth().listUsers();

    // Filter users who don't have a displayName or photoURL
    const usersToMigrate = userRecords.users.filter(
      (userRecord) => !userRecord.displayName || !userRecord.photoURL
    );

    // Migrate each user to the "users" collection
    for (const userRecord of usersToMigrate) {
      const { uid, displayName, email, photoURL } = userRecord.toJSON();

      const userData = {
        displayName: displayName || null,
        email,
        photoURL: photoURL || null,
      };

      // Create a new document in the "users" collection
      await firestore
        .collection("users")
        .doc(uid)
        .set(userData, { merge: true });
    }

    console.log("Migration completed successfully.");
  } else {
    console.log(
      "Migration is not needed. The 'users' collection is not empty."
    );
  }
};

migrateUsers();
