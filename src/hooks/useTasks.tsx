import { useState, useEffect } from "react";
import { Task } from "../atoms/tasksAtom";
import {
  addDoc,
  collection,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import { useToast } from "@chakra-ui/react";
import useUserPoints from "./useUserPoints";

const useTasks = (date: string, user: User) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { userPoints, computePointsForTask, updatePoints } =
    useUserPoints(user);

  const toast = useToast();

  const handleAddTask = async (
    task: string,
    description: string,
    goalId: string,
    date: string,
    color: string
  ) => {
    if (tasks.length < 10) {
      const taskToAdd: Task = {
        id: "",
        text: task,
        completed: false,
        date,
        userId: user.uid,
        description,
        goalId,
        color,
      };
      try {
        const docRef = await addDoc(collection(firestore, "tasks"), taskToAdd);
        taskToAdd.id = docRef.id;
        // setTasks([...tasks, taskToAdd]);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleCompleteTask = async (id: string) => {
    const taskToUpdate = tasks.find((task) => task.id === id);

    if (!taskToUpdate) {
      console.error(`Task with id ${id} not found.`);
      return;
    }

    // Clone the task and toggle its completed status
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    const updatedTasks = tasks.map((task) =>
      task.id === id ? updatedTask : task
    );

    setTasks(updatedTasks);

    // Calculate points using the computePointsForTask function
    const newPoints = computePointsForTask(
      taskToUpdate,
      updatedTask,
      userPoints
    );

    const pointDifference = newPoints - userPoints;
    await updatePoints(pointDifference);

    try {
      await updateDoc(doc(firestore, "tasks", id), {
        completed: updatedTask.completed,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleEditTask = async (
    id: string,
    newTask: string,
    newDescription: string,
    newGoalId: string,
    newTaskDate: string,
    newColor: string
  ) => {
    const originalTask = tasks.find((task) => task.id === id);

    if (!originalTask) {
      console.error(`Task with id ${id} not found.`);
      return;
    }

    const updatedTask = {
      ...originalTask,
      text: newTask,
      description: newDescription,
      goalId: newGoalId,
      date: newTaskDate,
      color: newColor,
    };

    try {
      const taskDocRef = doc(firestore, "tasks", id);
      await updateDoc(taskDocRef, {
        text: updatedTask.text,
        description: updatedTask.description,
        goalId: updatedTask.goalId,
        date: updatedTask.date,
        color: updatedTask.color,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id);

    if (!taskToDelete) {
      console.error(`Task with id ${id} not found.`);
      return;
    }

    let pointsToDeduct = 0;

    // If the task was completed, deduct points
    if (taskToDelete.completed) {
      pointsToDeduct += 2;

      // If the task is linked to a goal, deduct additional points
      if (taskToDelete.goalId) {
        pointsToDeduct += 1;
      }
    }

    await updatePoints(-pointsToDeduct);

    // Filter out the task from the local state
    setTasks(tasks.filter((task) => task.id !== id));

    // Delete the task from Firebase
    try {
      await deleteDoc(doc(firestore, "tasks", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    const taskCollection = collection(firestore, "tasks");
    const q = query(
      taskCollection,
      where("date", "==", date),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksForDay: Task[] = [];
        snapshot.forEach((doc) => {
          const task = doc.data() as Task;
          task.id = doc.id;
          tasksForDay.push(task);
        });
        setTasks(tasksForDay);
      },

      (error) => {
        console.error("Error fetching tasks:", error);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [user, date]);

  return {
    tasks,
    setTasks,
    handleAddTask,
    handleCompleteTask,
    handleEditTask,
    handleDeleteTask,
    userPoints,
  };
};
export default useTasks;
