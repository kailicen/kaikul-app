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
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useRecoilState } from "recoil";
import { useStatistics } from "./useStatistics";
import moment from "moment";
import { Task, weekTaskListState } from "@/atoms/tasksAtom";

export const useGoals = (user: User, startOfWeek: string) => {
  const [recoilGoals, setRecoilGoals] = useRecoilState(
    weeklyGoalListState(startOfWeek)
  );
  // Fetch tasks for the current week
  const endOfWeek = moment(startOfWeek).add(6, "days").format("YYYY-MM-DD");
  const [weekTasks, setWeekTasks] = useRecoilState(
    weekTaskListState([startOfWeek, endOfWeek])
  );
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const { fetchTasks } = useStatistics();

  const handleAddGoal = async (
    goal: string,
    description: string,
    color: string
  ) => {
    const goalToAdd: WeeklyGoal = {
      id: "", // Placeholder value, will be updated after adding the document
      text: goal,
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
      setRecoilGoals([...goals, goalToAdd]);
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
      setRecoilGoals(updatedGoals);
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
      });
      setGoals(updatedGoals);
      setRecoilGoals(updatedGoals);

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

      // Update Recoil state
      setWeekTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
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
      setRecoilGoals(goalsForWeek);
    };
    loadGoals();
  }, [user, startOfWeek]);

  return {
    goals,
    recoilGoals: recoilGoals,
    handleAddGoal,
    handleCompleteGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  };
};
