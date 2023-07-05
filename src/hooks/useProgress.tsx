import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { Blocker } from "@/atoms/blockersAtom";
import { Task } from "@/atoms/tasksAtom";
import { WeeklyGoal } from "@/atoms/weeklyGoalsAtom";

export type ProgressOption = "Daily Progress" | "Weekly Progress";

const useProgress = (selectedProgress: ProgressOption, lastOpened: Date) => {
  const [user] = useAuthState(auth);
  const [yesterdayTasks, setYesterdayTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [weeklyBlockers, setWeeklyBlockers] = useState<Blocker[]>([]);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);

  useEffect(() => {
    const fetchDailyProgress = async () => {
      if (user) {
        const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");
        const today = moment().format("YYYY-MM-DD");

        // Fetch yesterday's tasks
        const yesterdayTasksQuery = query(
          collection(firestore, "tasks"),
          where("userId", "==", user.uid),
          where("date", "==", yesterday)
        );
        const yesterdayTasksSnapshot = await getDocs(yesterdayTasksQuery);
        const fetchedYesterdayTasks = yesterdayTasksSnapshot.docs.map(
          (doc) => doc.data() as Task
        );

        // Fetch today's tasks
        const todayTasksQuery = query(
          collection(firestore, "tasks"),
          where("userId", "==", user.uid),
          where("date", "==", today)
        );
        const todayTasksSnapshot = await getDocs(todayTasksQuery);
        const fetchedTodayTasks = todayTasksSnapshot.docs.map(
          (doc) => doc.data() as Task
        );

        setYesterdayTasks(fetchedYesterdayTasks);
        setTodayTasks(fetchedTodayTasks);

        // Fetch yesterday's blockers
        const yesterdayBlockersQuery = query(
          collection(firestore, "blockers"),
          where("userId", "==", user.uid),
          where("date", "==", yesterday)
        );
        const yesterdayBlockersSnapshot = await getDocs(yesterdayBlockersQuery);
        const fetchedYesterdayBlockers = yesterdayBlockersSnapshot.docs.map(
          (doc) => doc.data() as Blocker
        );

        setBlockers(fetchedYesterdayBlockers);
      }
    };

    const fetchWeeklyProgress = async () => {
      if (user) {
        const weekStart = moment().startOf("week").format("YYYY-MM-DD");
        const weekEnd = moment().endOf("week").format("YYYY-MM-DD");

        // Fetch weekly goals
        const weeklyGoalsQuery = query(
          collection(firestore, "weeklyGoals"),
          where("userId", "==", user.uid),
          where("weekStart", ">=", weekStart),
          where("weekStart", "<=", weekEnd)
        );
        const weeklyGoalsSnapshot = await getDocs(weeklyGoalsQuery);
        const fetchedWeeklyGoals = weeklyGoalsSnapshot.docs.map(
          (doc) => doc.data() as WeeklyGoal
        );

        // Fetch tasks for the week
        const tasksQuery = query(
          collection(firestore, "tasks"),
          where("userId", "==", user.uid),
          where("date", ">=", weekStart),
          where("date", "<=", weekEnd)
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        const fetchedTasks = tasksSnapshot.docs.map(
          (doc) => doc.data() as Task
        );
        const completedTasksCount = fetchedTasks.filter(
          (task) => task.completed
        ).length;

        // Fetch weekly blockers
        const weeklyBlockersQuery = query(
          collection(firestore, "blockers"),
          where("userId", "==", user.uid),
          where("date", ">=", weekStart),
          where("date", "<=", weekEnd)
        );
        const weeklyBlockersSnapshot = await getDocs(weeklyBlockersQuery);
        const fetchedWeeklyBlockers = weeklyBlockersSnapshot.docs.map(
          (doc) => doc.data() as Blocker
        );

        setWeeklyGoals(fetchedWeeklyGoals);
        setTotalTasks(fetchedTasks.length);
        setCompletedTasks(completedTasksCount);
        setWeeklyBlockers(fetchedWeeklyBlockers);
      }
    };

    if (selectedProgress === "Daily Progress") {
      fetchDailyProgress().catch((error) => {
        console.error("Error fetching daily progress:", error);
      });
    } else if (selectedProgress === "Weekly Progress") {
      fetchWeeklyProgress().catch((error) => {
        console.error("Error fetching weekly progress:", error);
      });
    }
  }, [user, selectedProgress, , lastOpened]);

  return {
    user,
    yesterdayTasks,
    todayTasks,
    blockers,
    weeklyGoals,
    weeklyBlockers,
    totalTasks,
    completedTasks,
  };
};

export default useProgress;
