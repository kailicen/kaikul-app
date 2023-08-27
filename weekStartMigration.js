const admin = require("firebase-admin");
const { addDays } = require("date-fns");

// Initialize Firebase Admin SDK
const serviceAccount = require("./kaikul-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Retrieve the default Firestore instance
const firestore = admin.firestore();

const migrateData = async () => {
  try {
    // Fetch all goals with a weekStart
    const weeklyGoalsCollection = firestore.collection("weeklyGoals");
    const snapshot = await weeklyGoalsCollection
      .where("weekStart", "!=", null)
      .get();

    if (snapshot.empty) {
      console.log("No matching documents found.");
      return;
    }

    const batch = firestore.batch(); // Initiate a batch

    snapshot.forEach((doc) => {
      const goal = doc.data();
      const endDate = addDays(new Date(goal.weekStart), 6);
      const endDateString = format(endDate, "yyyy-MM-dd");

      // Add this update operation to the batch
      const goalRef = weeklyGoalsCollection.doc(doc.id);
      batch.update(goalRef, {
        startDate: goal.weekStart,
        endDate: endDateString,
        weekStart: admin.firestore.FieldValue.delete(),
      });
    });

    // Commit the batch
    await batch.commit();
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error migrating data: ", error);
  }
};

// Call the function
migrateData();
