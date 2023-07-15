import { useState, useEffect } from "react";
import { Task } from "../atoms/tasksAtom";
import {
  addDoc,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import { useRecoilState } from "recoil";

export const useTasks = (date: string, user: User) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = async (
    task: string,
    description: string,
    goalId: string,
    color: string
  ) => {
    if (tasks.length < 5) {
      const taskToAdd: Task = {
        id: "",
        text: task,
        completed: false,
        date: date,
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
    newColor: string
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            text: newTask,
            description: newDescription,
            goalId: newGoalId,
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
    const loadTasks = async () => {
      const q = query(
        collection(firestore, "tasks"),
        where("date", "==", date),
        where("userId", "==", user.uid) // Filter goals by user ID
      );
      const querySnapshot = await getDocs(q);
      const tasksForDay: Task[] = [];
      querySnapshot.forEach((doc) => {
        const task = doc.data() as Task;
        task.id = doc.id;
        tasksForDay.push(task);
      });
      setTasks(tasksForDay);
    };
    loadTasks();
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
