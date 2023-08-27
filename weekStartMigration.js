const migrateData = async () => {
  // Fetch all goals with a weekStart
  const q = query(
    collection(firestore, "weeklyGoals"),
    where("weekStart", "!=", null), // This fetches documents where weekStart exists
    where("userId", "==", user.uid)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const goal = doc.data();

    // Get the endDate using your method (like adding 6 days to startOfWeek)
    const endDate = addDays(new Date(goal.weekStart), 6);

    // Update the document with new startDate, endDate and remove weekStart
    updateDoc(docRef(firestore, "weeklyGoals", doc.id), {
      startDate: goal.weekStart,
      endDate: endDate,
      weekStart: deleteField(), // This will delete the weekStart field
    });
  });
};

// You can call this function once for each user to migrate their data
migrateData();
