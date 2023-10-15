import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  FirestoreError,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import { Task } from "@/atoms/tasksAtom";
import { useGoals } from "./useGoals";
import { endOfWeek, format, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { Goal } from "@/atoms/goalsAtom";

export const useWeeklyTasksAndGoals = (
  user: User,
  currentWeekStart: string
) => {
  const [structuredGoals, setStructuredGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | FirestoreError>(null);

  const { goals } = useGoals(user, currentWeekStart);

  // Get the user's timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startOfWeekDate = parseISO(currentWeekStart);
  const zonedStartOfWeek = utcToZonedTime(startOfWeekDate, timeZone);
  const zonedEndOfWeek = endOfWeek(zonedStartOfWeek, { weekStartsOn: 1 });

  // Formatting the endOfWeek to the desired format
  const formattedZonedEndOfWeek = format(zonedEndOfWeek, "yyyy-MM-dd");

  useEffect(() => {
    setLoading(true);

    // Your existing goals fetching logic here...
    console.log(goals);

    const tasksCollection = collection(firestore, "tasks");

    const unsubscribeTasks = onSnapshot(
      query(tasksCollection, where("userId", "==", user.uid)),
      async (snapshot) => {
        const tasksForWeek: Task[] = [];
        snapshot.forEach((doc) => {
          const task = doc.data() as Task;
          task.id = doc.id;
          // Apply the condition client-side
          if (
            task.date >= currentWeekStart &&
            task.date <= formattedZonedEndOfWeek
          ) {
            tasksForWeek.push(task);
          }
        });

        // Assumption: You’ve fetched and set your goals in the `goals` state
        // Here, we create a new array, `structuredGoals`, which includes
        const seenTexts = new Set();
        const uniqueTasksForWeek = tasksForWeek.filter((task) => {
          if (!seenTexts.has(task.text)) {
            seenTexts.add(task.text);
            return true;
          }
          return false;
        });

        const structuredGoals = goals.map((goal) => {
          return {
            ...goal,
            tasks: uniqueTasksForWeek.filter((task) => task.goalId === goal.id),
          };
        });

        setStructuredGoals(structuredGoals);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setError(error);
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribeTasks();
  }, [user, currentWeekStart, formattedZonedEndOfWeek, goals]);

  return { structuredGoals, loading, error };
};
