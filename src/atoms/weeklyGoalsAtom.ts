import { atom, DefaultValue, selectorFamily } from "recoil";

export type Goal = {
  id: string;
  text: string;
  completed: boolean;
  weekStart: string; // represents the first day of a week in the format 'yyyy-mm-dd'
  userId: string | null;
  description?: string;
  tasks?: string[]; // This is an array of task IDs
  color?: string; // This is the selected color for the goal
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
        updatedWeeklyGoalState[weekStart] =
          newValue instanceof DefaultValue ? [] : newValue;
        return updatedWeeklyGoalState;
      });
    },
});
