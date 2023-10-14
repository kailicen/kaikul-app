import { useCallback, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, firestore } from "@/firebase/clientApp";
import { Reflection } from "@/atoms/reflectionsAtom";
import { Task } from "@/atoms/tasksAtom";
import { Goal } from "@/atoms/goalsAtom";
import { format } from "date-fns";

export const useStatistics = () => {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blockers, setBlockers] = useState<Reflection[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchTasks = useCallback(
    async (start: Date, end: Date) => {
      const startString = format(start, "yyyy-MM-dd");
      const endString = format(end, "yyyy-MM-dd");
      //console.log(`fetchTasks:start:${startString}, end:${endString}`);

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
        (doc) => doc.data() as Reflection
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

      // Query based on startDate
      const qStartDate = query(
        collection(firestore, "weeklyGoals"),
        where("userId", "==", user?.uid),
        where("startDate", "<=", endString)
      );

      // Query based on endDate
      const qEndDate = query(
        collection(firestore, "weeklyGoals"),
        where("userId", "==", user?.uid),
        where("endDate", ">=", startString)
      );

      const querySnapshotStartDate = await getDocs(qStartDate);
      const querySnapshotEndDate = await getDocs(qEndDate);

      const goalsFromStartDate: Goal[] = querySnapshotStartDate.docs.map(
        (doc) => {
          const goal = doc.data() as Goal;
          goal.id = doc.id;
          return goal;
        }
      );

      const goalsFromEndDate: Goal[] = querySnapshotEndDate.docs.map((doc) => {
        const goal = doc.data() as Goal;
        goal.id = doc.id;
        return goal;
      });

      // Find the intersection of the two goal arrays by id
      const goalsForWeek: Goal[] = goalsFromStartDate.filter((goalStart) =>
        goalsFromEndDate.some((goalEnd) => goalEnd.id === goalStart.id)
      );

      // Update the Recoil state for the current week's goals
      setGoals(goalsForWeek);

      return goalsForWeek; // Return the fetched goals
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

  const getWeeklyStats = async (weekStartDate: string) => {
    let totalFocusHours = 0;

    // Calculating the weekEndDate by adding 6 days to weekStartDate
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    try {
      // Use fetchTasks to get all tasks for the week
      const weeklyTasks = await fetchTasks(startDate, endDate);

      // Sum up all focusHours
      totalFocusHours = weeklyTasks.reduce((total, task) => {
        return total + (task.focusHours ?? 0); // Using nullish coalescing to handle possible undefined
      }, 0);

      // Calculate completion rate and completed items count
      const { completionRate, completedCount } = calculateCompletionRate(
        weeklyTasks,
        "tasks"
      );

      // Return the calculated values
      return { totalFocusHours, completionRate, completedCount };
    } catch (error) {
      console.error("Error fetching tasks: ", error);
      return { totalFocusHours: 0, completionRate: 0, completedCount: 0 };
    }
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
    getWeeklyStats,
  };
};
