import { useState, useEffect } from "react";
import { Goal, weeklyGoalListState, weeklyGoalState } from "../atoms/goalsAtom";
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
  getDoc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useRecoilState, useRecoilValue } from "recoil";
import { useStatistics } from "./useStatistics";
import moment from "moment";
import { Task, weekTaskListState } from "@/atoms/tasksAtom";
import { userPointsState } from "@/atoms/userPointsAtom";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  parseISO,
} from "date-fns";
import { useToast } from "@chakra-ui/react";

// Function to compute points based on the goal's duration
function computeGoalPoints(startDate: string, endDate: string): number {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const durationInDays = differenceInDays(end, start);
  const durationInMonths = differenceInMonths(end, start);
  const durationInYears = differenceInYears(end, start);

  if (durationInDays <= 30) {
    return 10;
  } else if (durationInMonths <= 3) {
    return 30;
  } else if (durationInYears < 1) {
    return 50;
  } else {
    return 100; // Over a year
  }
}

// Function to compute points for completing/uncompleting a goal
function computePointsForGoal(
  originalGoal: Goal,
  updatedGoal: Goal,
  currentPoints: number
): number {
  let newPoints = currentPoints;

  // Get the point value for the goal duration
  const pointsForCompletion = computeGoalPoints(
    updatedGoal.startDate,
    updatedGoal.endDate
  );

  // If the original goal was NOT completed, but the updated goal IS completed
  if (!originalGoal.completed && updatedGoal.completed) {
    newPoints += pointsForCompletion;
  }
  // If the original goal WAS completed, but the updated goal is NOT completed
  else if (originalGoal.completed && !updatedGoal.completed) {
    newPoints -= pointsForCompletion;
  }

  return newPoints;
}

export const useGoals = (user: User, startOfWeek: string) => {
  const [recoilGoals, setRecoilGoals] = useRecoilState(weeklyGoalListState);
  const [userPoints, setUserPoints] = useRecoilState(userPointsState);

  // Fetch tasks for the current week
  const endOfWeek = moment(startOfWeek).add(6, "days").format("YYYY-MM-DD");
  const [weekTasks, setWeekTasks] = useRecoilState(
    weekTaskListState([startOfWeek, endOfWeek])
  );
  const [goals, setGoals] = useState<Goal[]>([]);
  const { fetchTasks } = useStatistics();
  const toast = useToast();

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
      if (
        moment(goalToAdd.startDate).isSameOrBefore(endOfWeek) &&
        moment(goalToAdd.endDate).isSameOrAfter(startOfWeek)
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

    setUserPoints(newPoints); // Update the user's points in local state
    syncPointsToFirebase(user.uid, newPoints); // Sync the new points with Firebase

    const pointDifference = newPoints - userPoints; // Calculate the difference in points
    toast({
      title: pointDifference > 0 ? "Points Earned!" : "Points Deducted",
      description: `You ${pointDifference > 0 ? "earned" : "lost"} ${Math.abs(
        pointDifference
      )} points.`,
      status: pointDifference > 0 ? "success" : "warning",
      duration: 5000,
      isClosable: true,
    });

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
      await updateDoc(goalDocRef, {
        text: updatedGoal.text,
        description: updatedGoal.description,
        color: updatedGoal.color,
        startDate: updatedGoal.startDate,
        endDate: updatedGoal.endDate,
      });

      const tasks = await fetchTasks(
        new Date(startOfWeek),
        new Date(endOfWeek)
      );

      let updatedTasks: Task[] = [];
      const batch = writeBatch(firestore);

      // Update the color of the tasks associated with the updated goal
      for (const task of tasks) {
        let updatedTask = { ...task };
        if (task.goalId === id) {
          const taskDocRef = doc(firestore, "tasks", task.id);
          batch.update(taskDocRef, {
            color: updatedGoal.color,
          });

          updatedTask.color = updatedGoal.color;
        }
        updatedTasks.push(updatedTask);
      }

      // Commit the batch
      await batch.commit();

      // Check if the updated goal is within the current week
      if (
        moment(updatedGoal.startDate).isSameOrBefore(endOfWeek) &&
        moment(updatedGoal.endDate).isSameOrAfter(startOfWeek)
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
      const newPoints = userPoints - pointsToDeduct;

      setUserPoints(newPoints); // Update the user's points in local state
      syncPointsToFirebase(user.uid, newPoints); // Sync the new points with Firebase

      toast({
        title: "Points Deducted",
        description: `You lost ${pointsToDeduct} points.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }

    setGoals(goals.filter((goal) => goal.id !== id));
    setRecoilGoals(goals.filter((goal) => goal.id !== id));

    // Fetch tasks associated with the goal
    const tasks = await fetchTasks(new Date(startOfWeek), new Date(endOfWeek));
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

  const syncPointsToFirebase = async (userId: string, points: number) => {
    const userPointsDocRef = doc(firestore, "userPoints", userId);
    try {
      await setDoc(userPointsDocRef, { userId, points }, { merge: true });
    } catch (error) {
      console.error("Error syncing points to Firebase:", error);
    }
  };

  useEffect(() => {
    const loadGoals = async () => {
      // Query based on startDate
      const qStartDate = query(
        collection(firestore, "weeklyGoals"),
        where("startDate", "<=", endOfWeek),
        where("userId", "==", user.uid)
      );

      // Query based on endDate
      const qEndDate = query(
        collection(firestore, "weeklyGoals"),
        where("endDate", ">=", startOfWeek),
        where("userId", "==", user.uid)
      );

      const querySnapshotStartDate = await getDocs(qStartDate);
      const querySnapshotEndDate = await getDocs(qEndDate);

      const goalsFromStartDate: Goal[] = [];
      const goalsFromEndDate: Goal[] = [];

      querySnapshotStartDate.forEach((doc) => {
        const goal = doc.data() as Goal;
        goal.id = doc.id;
        goalsFromStartDate.push(goal);
      });

      querySnapshotEndDate.forEach((doc) => {
        const goal = doc.data() as Goal;
        goal.id = doc.id;
        goalsFromEndDate.push(goal);
      });

      // Find the intersection of the two goal arrays by id
      const goalsForWeek: Goal[] = goalsFromStartDate.filter((goalStart) =>
        goalsFromEndDate.some((goalEnd) => goalEnd.id === goalStart.id)
      );

      setGoals(goalsForWeek);
      setRecoilGoals(goalsForWeek);
    };

    loadGoals();
  }, [user, startOfWeek, endOfWeek]);

  return {
    goals,
    recoilGoals: recoilGoals,
    handleAddGoal,
    handleCompleteGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  };
};
