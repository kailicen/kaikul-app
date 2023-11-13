import { useState, useEffect } from "react";
import { Goal, SubGoal, weeklyGoalListState } from "../atoms/goalsAtom";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  updateDoc,
  where,
  getDocs,
  query,
  doc,
  writeBatch,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useRecoilState } from "recoil";
import { useStatistics } from "./useStatistics";
import { Task, weekTaskListState } from "@/atoms/tasksAtom";
import useUserPoints from "./useUserPoints";
import {
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const useGoals = (user: User, startOfWeekString: string) => {
  const [loading, setLoading] = useState(true); // New loading state

  const [recoilGoals, setRecoilGoals] = useRecoilState(weeklyGoalListState);
  const { userPoints, computePointsForGoal, computeGoalPoints, updatePoints } =
    useUserPoints(user);

  // Get the user's timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startOfWeekDate = parseISO(startOfWeekString);
  const zonedStartOfWeek = utcToZonedTime(startOfWeekDate, timeZone);
  const zonedEndOfWeek = endOfWeek(zonedStartOfWeek, { weekStartsOn: 1 });

  // Formatting the endOfWeek to the desired format
  const formattedZonedEndOfWeek = format(zonedEndOfWeek, "yyyy-MM-dd");

  const [weekTasks, setWeekTasks] = useRecoilState(
    weekTaskListState([startOfWeekString, formattedZonedEndOfWeek])
  );
  const [goals, setGoals] = useState<Goal[]>([]);
  const { fetchTasks } = useStatistics();

  const handleAddGoal = async (
    goal: string,
    description: string,
    color: string,
    startDate: string,
    endDate: string
  ) => {
    const goalToAdd: Goal = {
      id: "", // Placeholder value, will be updated after adding the document
      text: goal,
      completed: false,
      startDate,
      endDate,
      userId: user.uid,
      description, // add the description
      color, // add the color
    };
    try {
      const docRef = await addDoc(
        collection(firestore, "weeklyGoals"),
        goalToAdd
      );
      goalToAdd.id = docRef.id; // Update the id value

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const goalStartDate = utcToZonedTime(goalToAdd.startDate, userTimezone);
      const goalEndDate = utcToZonedTime(goalToAdd.endDate, userTimezone);

      if (
        (isBefore(goalStartDate, zonedEndOfWeek) ||
          isEqual(goalStartDate, zonedEndOfWeek)) &&
        (isAfter(goalEndDate, zonedStartOfWeek) ||
          isEqual(goalEndDate, zonedStartOfWeek))
      ) {
        setGoals([...goals, goalToAdd]);
        setRecoilGoals([...goals, goalToAdd]);
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleCompleteGoal = async (id: string) => {
    const goalToUpdate = goals.find((goal) => goal.id === id);

    if (!goalToUpdate) {
      console.error(`Goal with id ${id} not found.`);
      return;
    }

    // Clone the goal and toggle its completed status
    const updatedGoal = { ...goalToUpdate, completed: !goalToUpdate.completed };

    const updatedGoals = goals.map((goal) =>
      goal.id === id ? updatedGoal : goal
    );

    setGoals(updatedGoals);

    // Calculate points using the computePointsForGoal function
    const newPoints = computePointsForGoal(
      goalToUpdate,
      updatedGoal,
      userPoints
    );

    const pointDifference = newPoints - userPoints; // Calculate the difference in points
    await updatePoints(pointDifference);

    // Update the goal in Firebase (you might need to adjust this according to your Firebase structure)
    try {
      await updateDoc(doc(firestore, "weeklyGoals", id), {
        completed: updatedGoals.find((goal) => goal.id === id)?.completed,
      });
      setGoals(updatedGoals);
      setRecoilGoals(updatedGoals);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleUpdateGoal = async (
    id: string,
    newText: string,
    newDescription: string,
    newColor: string,
    newStartDate: string,
    newEndDate: string
  ) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            text: newText,
            description: newDescription,
            color: newColor,
            startDate: newStartDate,
            endDate: newEndDate,
          }
        : goal
    );

    const updatedGoal = updatedGoals.find((goal) => goal.id === id);

    if (!updatedGoal) {
      console.error(`Goal with id ${id} not found.`);
      return;
    }

    try {
      const goalDocRef = doc(firestore, "weeklyGoals", id);

      const goalDoc = await getDoc(goalDocRef);

      if (!goalDoc.exists()) {
        console.error(`Goal with id ${id} not found.`);
        return;
      }

      const goalData = goalDoc.data() as Goal;
      const updatedSubGoals = (goalData.subGoals || []).map((subGoal) => ({
        ...subGoal,
        color: newColor,
      }));

      await updateDoc(goalDocRef, {
        text: updatedGoal.text,
        description: updatedGoal.description,
        color: updatedGoal.color,
        startDate: updatedGoal.startDate,
        endDate: updatedGoal.endDate,
        subGoals: updatedSubGoals, // Updating embedded tasks
      });

      const taskQuery = query(
        collection(firestore, "tasks"),
        where("goalId", "==", id)
      );

      const taskSnapshot = await getDocs(taskQuery);

      const updatedTasks: Task[] = [];
      const batch = writeBatch(firestore);

      taskSnapshot.forEach((taskDoc) => {
        const task = taskDoc.data() as Task; // Assumes `Task` is a TypeScript type representing your task structure
        const taskDocRef = doc(firestore, "tasks", taskDoc.id);

        batch.update(taskDocRef, {
          color: updatedGoal.color,
        });

        updatedTasks.push({ ...task, color: updatedGoal.color });
      });

      // Commit the batch
      await batch.commit();

      // Check if the updated goal is within the current week
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const goalStartDate = utcToZonedTime(updatedGoal.startDate, userTimezone);
      const goalEndDate = utcToZonedTime(updatedGoal.endDate, userTimezone);

      if (
        (isBefore(goalStartDate, zonedEndOfWeek) ||
          isEqual(goalStartDate, zonedEndOfWeek)) &&
        (isAfter(goalEndDate, zonedStartOfWeek) ||
          isEqual(goalEndDate, zonedStartOfWeek))
      ) {
        setGoals(updatedGoals);
        setRecoilGoals(updatedGoals);
      } else {
        const filteredGoals = updatedGoals.filter((goal) => goal.id !== id);
        setGoals(filteredGoals);
        setRecoilGoals(filteredGoals);
      }

      // Update Recoil state
      setWeekTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    const goalToDelete = goals.find((goal) => goal.id === id);

    if (!goalToDelete) {
      console.error(`Goal with id ${id} not found.`);
      return;
    }

    // Check if the goal to be deleted is completed
    if (goalToDelete.completed) {
      const pointsToDeduct = computeGoalPoints(
        goalToDelete.startDate,
        goalToDelete.endDate
      );
      await updatePoints(-pointsToDeduct);
    }

    setGoals(goals.filter((goal) => goal.id !== id));
    setRecoilGoals(goals.filter((goal) => goal.id !== id));

    // Fetch tasks associated with the goal
    const tasks = await fetchTasks(
      new Date(startOfWeekString),
      new Date(formattedZonedEndOfWeek)
    );
    const tasksForGoal = tasks.filter((task) => task.goalId === id);

    if (tasksForGoal.length > 0) {
      const batch = writeBatch(firestore);

      tasksForGoal.forEach((task) => {
        const taskDocRef = doc(firestore, "tasks", task.id);
        batch.update(taskDocRef, {
          goalId: "", // Unlink the task from the goal
          color: "",
        });
      });

      await batch.commit();

      // Update the Recoil state
      const updatedWeekTasks = tasks.map((task) =>
        task.goalId === id ? { ...task, goalId: "", color: "" } : task
      );
      setWeekTasks(updatedWeekTasks);
    }

    try {
      await deleteDoc(doc(firestore, "weeklyGoals", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleUpdateGoalAddSubGoal = async (
    id: string,
    subGoals: SubGoal[]
  ) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            subGoals: subGoals,
          }
        : goal
    );

    const updatedGoal = updatedGoals.find((goal) => goal.id === id);

    if (!updatedGoal) {
      console.error(`Goal with id ${id} not found.`);
      return;
    }

    try {
      const goalDocRef = doc(firestore, "weeklyGoals", id);
      await updateDoc(goalDocRef, {
        subGoals: updatedGoal.subGoals,
      });
      setGoals(updatedGoals);
      setRecoilGoals(updatedGoals);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    setLoading(true); // Start loading before fetching data
    const weeklyGoalsCollection = collection(firestore, "weeklyGoals");

    // Query based on one condition first
    const q = query(
      weeklyGoalsCollection,
      where("startDate", "<=", formattedZonedEndOfWeek),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const goalsForWeek: Goal[] = [];
        snapshot.forEach((doc) => {
          const goal = doc.data() as Goal;
          goal.id = doc.id;
          // apply the second condition client-side
          if (goal.endDate >= startOfWeekString) {
            // Sorting logic for tasks based on priority strings
            // Filter subGoals based on the current week
            if (goal.subGoals && goal.subGoals.length > 0) {
              goal.subGoals = goal.subGoals.filter(
                (subGoal) =>
                  subGoal.startDate <= formattedZonedEndOfWeek &&
                  subGoal.endDate >= startOfWeekString
              );

              // Sorting logic for tasks based on priority strings
              goal.subGoals.sort((a, b) => {
                return +a.priority - +b.priority;
              });
            }

            goalsForWeek.push(goal);
          }
        });
        setGoals(goalsForWeek);
        setRecoilGoals(goalsForWeek);
        setLoading(false); // Stop loading after data is processed
      },
      (error) => {
        console.error("Error fetching goals:", error);
        setLoading(false); // Stop loading if an error occurs
      }
    );

    // Cleanup listener on component unmount
    return () => {
      unsubscribe();
      setLoading(false); // Ensure loading is false when unmounting
    };
  }, [user, formattedZonedEndOfWeek, endOfWeek]);

  return {
    goals,
    recoilGoals,
    loading, // Include the loading state in the return value
    handleAddGoal,
    handleCompleteGoal,
    handleUpdateGoal,
    handleDeleteGoal,
    handleUpdateGoalAddTask: handleUpdateGoalAddSubGoal,
  };
};
