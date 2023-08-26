import { useCallback, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, firestore } from "@/firebase/clientApp";
import { Blocker } from "@/atoms/blockersAtom";
import { Task } from "@/atoms/tasksAtom";
import { Goal } from "@/atoms/weeklyGoalsAtom";
import { format } from "date-fns";

export const useStatistics = () => {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchTasks = useCallback(
    async (start: Date, end: Date) => {
      const startString = format(start, "yyyy-MM-dd");
      const endString = format(end, "yyyy-MM-dd");

      const tasksQuery = query(
        collection(firestore, "tasks"),
        where("userId", "==", user?.uid),
        where("date", ">=", startString),
        where("date", "<=", endString),
        orderBy("date")
      );

      const taskSnapshots = await getDocs(tasksQuery);

      // Update the Recoil state for the current week's tasks
      const tasks = taskSnapshots.docs.map((doc) => ({
        ...(doc.data() as Task), // spread the document data first
        id: doc.id, // then set the id property
      }));
      setTasks(tasks);

      return tasks; // Return the fetched tasks
    },
    [user]
  );

  const fetchBlockers = useCallback(
    async (start: Date, end: Date) => {
      const startString = format(start, "yyyy-MM-dd");
      const endString = format(end, "yyyy-MM-dd");

      const blockersQuery = query(
        collection(firestore, "blockers"),
        where("userId", "==", user?.uid),
        where("date", ">=", startString),
        where("date", "<=", endString),
        orderBy("date")
      );

      const blockerSnapshots = await getDocs(blockersQuery);

      // Update the Recoil state for the current week's blockers
      const blockers = blockerSnapshots.docs.map(
        (doc) => doc.data() as Blocker
      );
      setBlockers(blockers);

      return blockers; // Return the fetched tasks
    },
    [user]
  );

  const fetchGoals = useCallback(
    async (start: Date, end: Date) => {
      const startString = format(start, "yyyy-MM-dd");
      const endString = format(end, "yyyy-MM-dd");

      const goalsQuery = query(
        collection(firestore, "weeklyGoals"),
        where("userId", "==", user?.uid),
        where("weekStart", ">=", startString),
        where("weekStart", "<=", endString),
        orderBy("weekStart")
      );

      const goalSnapshots = await getDocs(goalsQuery);

      // Update the Recoil state for the current week's goals
      const goals = goalSnapshots.docs.map((doc) => doc.data() as Goal);
      setGoals(goals);

      return goals; // Return the fetched tasks
    },
    [user]
  );

  // Function to calculate completion rate and count of completed items
  const calculateCompletionRate = (
    data: (Task | Goal)[],
    dataType: "tasks" | "goals"
  ) => {
    if (data.length === 0) return { completionRate: 0, completedCount: 0 };

    const completedItems = data.filter((item) => item.completed === true);
    const completionRate = completedItems.length / data.length;
    const completedCount = completedItems.length;

    return { completionRate, completedCount };
  };

  return {
    user,
    tasks,
    blockers,
    goals,
    fetchTasks,
    fetchBlockers,
    fetchGoals,
    calculateCompletionRate,
  };
};
