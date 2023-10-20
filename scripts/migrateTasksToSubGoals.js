const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./kaikul-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const migrateTasksToSubGoals = async () => {
  const weeklyGoalsSnapshot = await db.collection("weeklyGoals").get();

  for (const doc of weeklyGoalsSnapshot.docs) {
    const docData = doc.data();

    // Transform tasks to subGoals
    if (docData.tasks) {
      const subGoals = docData.tasks.map((task) => ({
        color: task.color,
        description: task.description,
        endDate: docData.endDate || task.date, // Use the goal's endDate, fallback to task's date
        startDate: task.date,
        goalId: task.goalId,
        id: task.id,
        priority: task.priority,
        text: task.text,
        userId: task.userId,
      }));

      // Update the document with subGoals and remove tasks
      await doc.ref.update({
        subGoals: subGoals,
        tasks: admin.firestore.FieldValue.delete(),
      });
    }
  }
};

// Execute the migration function
migrateTasksToSubGoals()
  .then(() => {
    console.log("Migration completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error in migration:", err);
    process.exit(1);
  });
