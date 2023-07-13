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

  const handleAddGoal = async (description: string, color: string) => {
    const goalToAdd: WeeklyGoal = {
      id: "", // Placeholder value, will be updated after adding the document
      text: newGoal,
      completed: false,
      weekStart: startOfWeek,
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
      setGoals([...goals, goalToAdd]);
      setNewGoal("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const handleCompleteGoal = async (id: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );

    try {
      await updateDoc(doc(firestore, "weeklyGoals", id), {
        completed: updatedGoals.find((goal) => goal.id === id)?.completed,
      });
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleUpdateGoal = async (
    id: string,
    newText: string,
    newDescription: string,
    newColor: string
  ) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            text: newText,
            description: newDescription,
            color: newColor,
          }
        : goal
    );

    try {
      await updateDoc(doc(firestore, "weeklyGoals", id), {
        text: updatedGoals.find((goal) => goal.id === id)?.text,
        description: updatedGoals.find((goal) => goal.id === id)?.description,
        color: updatedGoals.find((goal) => goal.id === id)?.color,
      });
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));

    try {
      await deleteDoc(doc(firestore, "weeklyGoals", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
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
