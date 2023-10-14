const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./kaikul-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Retrieve the default Firestore instance
const firestore = admin.firestore();

const setDefaultPriorityForTasks = async () => {
  try {
    // Fetch all tasks
    const tasksSnapshot = await firestore.collection("tasks").get();

    // Prepare batch
    const batch = firestore.batch();

    // Loop through tasks and update each document that lacks a 'priority' field
    tasksSnapshot.forEach((doc) => {
      const taskData = doc.data();

      if (!("priority" in taskData)) {
        // Check if 'priority' does not exist
        const taskRef = firestore.collection("tasks").doc(doc.id);

        // Set 'priority' to '9'
        batch.update(taskRef, {
          priority: "9",
        });
      }
    });

    // Commit batch
    await batch.commit();
    console.log("All tasks updated successfully.");
  } catch (error) {
    console.error("Error updating tasks: ", error);
  }
};

// Run the function
setDefaultPriorityForTasks();
