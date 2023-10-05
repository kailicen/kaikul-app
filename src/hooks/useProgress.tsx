import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { Reflection } from "@/atoms/reflectionsAtom";
import { Task } from "@/atoms/tasksAtom";
import { format, startOfWeek, subDays } from "date-fns";
import { WeeklyReflection } from "@/atoms/weeklyReflectionAtom";
import { utcToZonedTime, format as formatTZ } from "date-fns-tz";

export type ProgressOption = "Daily Sprint" | "Weekly Reflection";

const useProgress = (selectedProgress: ProgressOption, lastOpened: Date) => {
  const [user] = useAuthState(auth);
  const [yesterdayTasks, setYesterdayTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [blockers, setBlockers] = useState<Reflection[]>([]);
  const [weeklyReflection, setWeeklyReflection] = useState<WeeklyReflection>();

  useEffect(() => {
    const fetchDailyProgress = async () => {
      if (user) {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const zonedToday = utcToZonedTime(new Date(), userTimeZone);
        const zonedYesterday = utcToZonedTime(
          subDays(new Date(), 1),
          userTimeZone
        );

        const today = formatTZ(zonedToday, "yyyy-MM-dd", {
          timeZone: userTimeZone,
        });
        const yesterday = formatTZ(zonedYesterday, "yyyy-MM-dd", {
          timeZone: userTimeZone,
        });

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
          (doc) => doc.data() as Reflection
        );

        setBlockers(fetchedYesterdayBlockers);
      }
    };

    const fetchWeeklyReflection = async () => {
      if (user) {
        // Get the user's timezone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const zonedCurrentDate = utcToZonedTime(new Date(), userTimeZone);
        const zonedWeekStart = startOfWeek(zonedCurrentDate, {
          weekStartsOn: 1,
        });

        const weekStart = formatTZ(zonedWeekStart, "yyyy-MM-dd", {
          timeZone: userTimeZone,
        });

        // Fetch weekly goals
        const weeklyReflectionQuery = query(
          collection(firestore, "teamTabs"),
          where("userId", "==", user.uid),
          where("startOfWeek", "==", weekStart)
        );
        const weeklyReflectionSnapshot = await getDocs(weeklyReflectionQuery);
        const fetchedweeklyReflection = weeklyReflectionSnapshot.docs.map(
          (doc) => doc.data() as WeeklyReflection
        );

        setWeeklyReflection(fetchedweeklyReflection[0]);
      }
    };

    if (selectedProgress === "Daily Sprint") {
      fetchDailyProgress().catch((error) => {
        console.error("Error fetching daily sprint:", error);
      });
    } else if (selectedProgress === "Weekly Reflection") {
      fetchWeeklyReflection().catch((error) => {
        console.error("Error fetching weekly reflection:", error);
      });
    }
  }, [user, selectedProgress, , lastOpened]);

  return {
    user,
    yesterdayTasks,
    todayTasks,
    blockers,
    weeklyReflection,
  };
};

export default useProgress;
