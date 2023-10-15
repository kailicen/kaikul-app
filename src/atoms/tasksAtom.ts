import { format } from "date-fns";
import { atom, DefaultValue, selectorFamily } from "recoil";

export type Task = {
  id?: string;
  text: string;
  completed?: boolean;
  date: string; // represents a date in the format 'yyyy-mm-dd'
  userId?: string | null;
  goalId?: string; // This is the ID of the associated goal
  description?: string;
  color?: string;
  priority: string;
  focusHours?: number;
};

interface TaskState {
  [date: string]: Task[];
}

// Define the state for a week's tasks
export const weekTaskState = atom<TaskState>({
  key: "weekTaskState",
  default: {},
});

// Define the selector family to access tasks for a specific week
export const weekTaskListState = selectorFamily<Task[], [string, string]>({
  key: "WeekTaskList",
  get:
    ([startOfWeek, endOfWeek]) =>
    ({ get }) => {
      const taskStateVal = get(weekTaskState);
      const weekTasks: Task[] = [];

      // We are going to iterate over each day of the week and gather all tasks
      const currentDay = new Date(startOfWeek);
      const endDay = new Date(endOfWeek);

      while (currentDay <= endDay) {
        const currentDayString = format(currentDay, "yyyy-MM-dd");
        const tasksForDay = taskStateVal[currentDayString] || [];
        weekTasks.push(...tasksForDay);
        currentDay.setDate(currentDay.getDate() + 1); // move to next day
      }

      return weekTasks;
    },
  set:
    ([startOfWeek, endOfWeek]) =>
    ({ set }, newValue) => {
      set(weekTaskState, (oldWeekTaskState) => {
        const updatedWeekTaskState = { ...oldWeekTaskState };
        const currentDay = new Date(startOfWeek);
        const endDay = new Date(endOfWeek);

        while (currentDay <= endDay) {
          const currentDayString = format(currentDay, "yyyy-MM-dd");
          updatedWeekTaskState[currentDayString] =
            newValue instanceof DefaultValue
              ? []
              : newValue.filter(
                  (task) =>
                    format(new Date(task.date), "yyyy-MM-dd") ===
                    currentDayString
                );
          currentDay.setDate(currentDay.getDate() + 1); // move to next day
        }

        return updatedWeekTaskState;
      });
    },
});
