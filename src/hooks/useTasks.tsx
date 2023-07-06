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

export const useTasks = (date: string, user: User) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [isEditing, setIsEditing] = useState<null | string>(null);
  const [editText, setEditText] = useState<string>("");

  const handleAddTask = async () => {
    if (tasks.length < 3) {
      const taskToAdd: Task = {
        id: "",
        text: newTask,
        completed: false,
        date: date,
        userId: user.uid,
      };
      try {
        const docRef = await addDoc(collection(firestore, "tasks"), taskToAdd);
        taskToAdd.id = docRef.id;
        setTasks([...tasks, taskToAdd]);
        setNewTask("");
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

  const handleEditTask = async (id: string, newValue: string) => {
    setIsEditing(null);
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: newValue } : task
    );
    setTasks(updatedTasks);

    try {
      await updateDoc(doc(firestore, "tasks", id), {
        text: updatedTasks.find((task) => task.id === id)?.text,
      });
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
  }, [user, date, setTasks]);

  return {
    tasks,
    newTask,
    isEditing,
    editText,
    setNewTask,
    setIsEditing,
    setEditText,
    handleAddTask,
    handleCompleteTask,
    handleEditTask,
    handleDeleteTask,
  };
};
export default useTasks;
