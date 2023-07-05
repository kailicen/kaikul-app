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
  const [isEditing, setIsEditing] = useState<null | number>(null);
  const [editText, setEditText] = useState<string>("");

  const handleAddTask = async () => {
    if (tasks.length < 3) {
      const taskToAdd: Task = {
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

  const handleCompleteTask = async (index: number) => {
    const taskToComplete = {
      ...tasks[index],
      completed: !tasks[index].completed,
    };
    if (taskToComplete.id) {
      // Check if id exists
      await updateDoc(
        doc(firestore, "tasks", taskToComplete.id),
        taskToComplete
      );
      setTasks(tasks.map((task, i) => (i === index ? taskToComplete : task)));
    }
  };

  const handleEditTask = async (index: number, newValue: string) => {
    setIsEditing(null);
    const taskToEdit = { ...tasks[index], text: newValue };
    if (taskToEdit.id) {
      await updateDoc(doc(firestore, "tasks", taskToEdit.id), taskToEdit);
      setTasks(tasks.map((task, i) => (i === index ? taskToEdit : task)));
    }
  };

  const handleDeleteTask = async (index: number) => {
    const taskToDelete = tasks[index];
    if (taskToDelete.id) {
      // Check if id exists
      await deleteDoc(doc(firestore, "tasks", taskToDelete.id));
      setTasks(tasks.filter((_, i) => i !== index));
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
