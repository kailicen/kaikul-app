import { useState, useEffect } from "react";
import { WeeklyGoal, weeklyGoalListState } from "../atoms/weeklyGoalsAtom";
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
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useRecoilState } from "recoil";

export const useGoals = (user: User, startOfWeek: string) => {
  const [weeklyGoals, setWeeklyGoals] = useRecoilState(
    weeklyGoalListState(startOfWeek)
  );
  const [newGoal, setNewGoal] = useState("");
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);

  const handleAddGoal = async () => {
    const goalToAdd: WeeklyGoal = {
      text: newGoal,
      completed: false,
      weekStart: startOfWeek,
      userId: user.uid,
    };
    try {
      const docRef = await addDoc(
        collection(firestore, "weeklyGoals"),
        goalToAdd
      );
      goalToAdd.id = docRef.id;
      setGoals([...goals, goalToAdd]);
      setNewGoal("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleCompleteGoal = async (index: number) => {
    const goalToComplete = {
      ...goals[index],
      completed: !goals[index].completed,
    };
    if (goalToComplete.id) {
      await updateDoc(
        doc(firestore, "weeklyGoals", goalToComplete.id),
        goalToComplete
      );
      setGoals(goals.map((goal, i) => (i === index ? goalToComplete : goal)));
    }
  };

  const handleUpdateGoal = async (index: number, newText: string) => {
    const goalToUpdate = {
      ...goals[index],
      text: newText,
    };
    if (goalToUpdate.id) {
      await updateDoc(
        doc(firestore, "weeklyGoals", goalToUpdate.id),
        goalToUpdate
      );
      setGoals(goals.map((goal, i) => (i === index ? goalToUpdate : goal)));
    }
  };

  const handleDeleteGoal = async (index: number) => {
    const goalToDelete = goals[index];
    if (goalToDelete.id) {
      await deleteDoc(doc(firestore, "weeklyGoals", goalToDelete.id));
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    const loadGoals = async () => {
      const q = query(
        collection(firestore, "weeklyGoals"),
        where("weekStart", "==", startOfWeek),
        where("userId", "==", user.uid) // Filter goals by user ID
      );
      const querySnapshot = await getDocs(q);
      const goalsForWeek: WeeklyGoal[] = [];
      querySnapshot.forEach((doc) => {
        const goal = doc.data() as WeeklyGoal;
        goal.id = doc.id;
        goalsForWeek.push(goal);
      });
      setGoals(goalsForWeek);
    };
    loadGoals();
  }, [user, startOfWeek, setGoals]);

  return {
    goals,
    newGoal,
    setNewGoal,
    handleAddGoal,
    handleCompleteGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  };
};
