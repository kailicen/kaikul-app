import { Goal } from "@/atoms/goalsAtom";
import { Task } from "@/atoms/tasksAtom";
import { userPointsState } from "@/atoms/userPointsAtom";
import { firestore } from "@/firebase/clientApp";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  parseISO,
} from "date-fns";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const useUserPoints = (user: User) => {
  const [userPoints, setUserPoints] = useRecoilState(userPointsState);

  const computePointsForTask = (
    originalTask: Task,
    updatedTask: Task,
    currentPoints: number
  ): number => {
    let newPoints = currentPoints;

    // If the original task was NOT completed, but the updated task IS completed
    if (!originalTask.completed && updatedTask.completed) {
      newPoints += 5;
      if (updatedTask.goalId) {
        newPoints += 2;
      }
    }
    // If the original task WAS completed, but the updated task is NOT completed
    else if (originalTask.completed && !updatedTask.completed) {
      newPoints -= 5;
      if (originalTask.goalId) {
        newPoints -= 2;
      }
    }

    return newPoints;
  };

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
  const computePointsForGoal = (
    originalGoal: Goal,
    updatedGoal: Goal,
    currentPoints: number
  ): number => {
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
    const fetchUserPointsFromFirebase = async () => {
      const userPointsDocRef = doc(firestore, "userPoints", user.uid);
      try {
        const docSnapshot = await getDoc(userPointsDocRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserPoints(data?.points || 0); // Set the user's points if found, else default to 0
        }
      } catch (error) {
        console.error("Error fetching user points from Firebase:", error);
      }
    };

    fetchUserPointsFromFirebase();
  }, [user]);

  return {
    userPoints,
    setUserPoints,
    computePointsForTask,
    computePointsForGoal,
    computeGoalPoints,
    syncPointsToFirebase,
  };
};

export default useUserPoints;
