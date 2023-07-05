import { useCallback, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, firestore } from "@/firebase/clientApp";
import { Blocker } from "@/atoms/blockersAtom";
import { Task } from "@/atoms/tasksAtom";
import { WeeklyGoal } from "@/atoms/weeklyGoalsAtom";
import moment from "moment";

export const useStatistics = () => {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);

  const fetchTasks = useCallback(
    async (start: Date, end: Date) => {
      const startString = moment(start).format("YYYY-MM-DD");
      const endString = moment(end).format("YYYY-MM-DD");

      const tasksQuery = query(
        collection(firestore, "tasks"),
        where("userId", "==", user?.uid),
        where("date", ">=", startString),
        where("date", "<=", endString),
        orderBy("date")
      );

      const taskSnapshots = await getDocs(tasksQuery);

      // Update the Recoil state for the current week's tasks
      const tasks = taskSnapshots.docs.map((doc) => doc.data() as Task);
      setTasks(tasks);

      return tasks; // Return the fetched tasks
    },
    [user]
  );

  const fetchBlockers = useCallback(
    async (start: Date, end: Date) => {
      const startString = moment(start).format("YYYY-MM-DD");
      const endString = moment(end).format("YYYY-MM-DD");

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
      const startString = moment(start).format("YYYY-MM-DD");
      const endString = moment(end).format("YYYY-MM-DD");

      const goalsQuery = query(
        collection(firestore, "weeklyGoals"),
        where("userId", "==", user?.uid),
        where("weekStart", ">=", startString),
        where("weekStart", "<=", endString),
        orderBy("weekStart")
      );

      const goalSnapshots = await getDocs(goalsQuery);

      // Update the Recoil state for the current week's goals
      const goals = goalSnapshots.docs.map((doc) => doc.data() as WeeklyGoal);
      setGoals(goals);

      return goals; // Return the fetched tasks
    },
    [user]
  );

  // Function to calculate completion rate
  const calculateCompletionRate = (
    data: (Task | WeeklyGoal)[],
    dataType: "tasks" | "goals"
  ) => {
    if (data.length === 0) return 0;

    const completedItems = data.filter((item) => {
      // For WeeklyGoal, we use the 'completed' field
      // For Task, we also use the 'completed' field
      return item.completed === true;
    });

    return completedItems.length / data.length;
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
