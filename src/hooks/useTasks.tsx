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
  setDoc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userPointsState } from "@/atoms/userPointsAtom";
import { useToast } from "@chakra-ui/react";

function computePointsForTask(
  originalTask: Task,
  updatedTask: Task,
  currentPoints: number
): number {
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
}

export const useTasks = (date: string, user: User) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPoints, setUserPoints] = useRecoilState(userPointsState);

  const toast = useToast();

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

    setUserPoints(newPoints); // Update the user's points in local state
    syncPointsToFirebase(user.uid, newPoints); // Sync the new points with Firebase

    // Inside handleCompleteTask function, after updating the points
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

    // Determine if a goalId has been added or removed
    let pointsChange = 0;
    if (!originalTask.goalId && newGoalId) {
      pointsChange += 2; // A goalId was added
    } else if (originalTask.goalId && !newGoalId) {
      pointsChange -= 2; // A goalId was removed
    }

    // Adjust user points based on the changes
    const newPoints = userPoints + pointsChange;
    setUserPoints(newPoints);
    syncPointsToFirebase(user.uid, newPoints);

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
      pointsToDeduct += 5;

      // If the task is linked to a goal, deduct additional points
      if (taskToDelete.goalId) {
        pointsToDeduct += 2;
      }
    }

    // Update user points after deducting
    const newPoints = userPoints - pointsToDeduct;
    setUserPoints(newPoints);
    syncPointsToFirebase(user.uid, newPoints);

    toast({
      title: "Points Deducted",
      description: `You lost ${pointsToDeduct} points.`,
      status: "warning",
      duration: 5000,
      isClosable: true,
    });

    // Filter out the task from the local state
    setTasks(tasks.filter((task) => task.id !== id));

    // Delete the task from Firebase
    try {
      await deleteDoc(doc(firestore, "tasks", id));
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
