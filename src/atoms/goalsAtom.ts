import { atom, DefaultValue, selectorFamily } from "recoil";
import { startOfWeek, format, eachWeekOfInterval } from "date-fns";

export type Goal = {
  id: string;
  text: string;
  completed: boolean;
  startDate: string;
  endDate: string;
  userId: string | null;
  description?: string;
  tasks?: string[];
  color?: string;
};

interface WeeklyGoalState {
  [weekStart: string]: Goal[];
}

export const weeklyGoalState = atom<WeeklyGoalState>({
  key: "weeklyGoalState",
  default: {},
});

export const weeklyGoalListState = selectorFamily<Goal[], string>({
  key: "WeeklyGoalList",
  get:
    (weekStart) =>
    ({ get }) => {
      const weeklyGoalStateVal = get(weeklyGoalState);
      return weeklyGoalStateVal[weekStart] || [];
    },
  set:
    (weekStart) =>
    ({ set }, newValue) => {
      set(weeklyGoalState, (oldWeeklyGoalState) => {
        const updatedWeeklyGoalState = { ...oldWeeklyGoalState };

        if (newValue instanceof DefaultValue) {
          updatedWeeklyGoalState[weekStart] = [];
        } else {
          newValue.forEach((goal) => {
            const goalWeekStart = startOfWeek(new Date(goal.startDate));
            const goalWeekEnd = startOfWeek(new Date(goal.endDate));

            const weeksGoalSpans = eachWeekOfInterval({
              start: goalWeekStart,
              end: goalWeekEnd,
            });

            weeksGoalSpans.forEach((week) => {
              const weekKey = format(week, "yyyy-MM-dd");

              // Create a new array for each week and then push the goal to that new array
              updatedWeeklyGoalState[weekKey] = updatedWeeklyGoalState[weekKey]
                ? [...updatedWeeklyGoalState[weekKey], goal]
                : [goal];
            });
          });
        }

        return updatedWeeklyGoalState;
      });
    },
});
