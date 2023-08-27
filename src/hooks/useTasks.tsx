import { useState, useEffect } from "react";
import { Task, weekTaskState } from "../atoms/tasksAtom";
import {
  addDoc,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import { useRecoilState } from "recoil";

export const useTasks = (date: string, user: User) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentWeekTasksState, setWeekTasksState] =
    useRecoilState(weekTaskState);

  const handleAddTask = async (
    task: string,
    description: string,
    goalId: string,
    date: string,
    color: string
  ) => {
    if (tasks.length < 5) {
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
        setTasks([...tasks, taskToAdd]);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleCompleteTask = async (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    try {
      await updateDoc(doc(firestore, "tasks", id), {
        completed: updatedTasks.find((task) => task.id === id)?.completed,
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
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            text: newTask,
            description: newDescription,
            goalId: newGoalId,
            date: newTaskDate,
            color: newColor,
          }
        : task
    );

    const updatedTask = updatedTasks.find((task) => task.id === id);

    if (!updatedTask) {
      console.error(`Task with id ${id} not found.`);
      return;
    }

    try {
      const taskDocRef = doc(firestore, "tasks", id);
      await updateDoc(taskDocRef, {
        text: updatedTask.text,
        description: updatedTask.description,
        goalId: updatedTask.goalId,
        date: updatedTask.date,
        color: updatedTask.color,
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));

    try {
      await deleteDoc(doc(firestore, "tasks", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    console.log("Fetching tasks for date:", date, "and user:", user.uid);

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
  };
};
export default useTasks;
