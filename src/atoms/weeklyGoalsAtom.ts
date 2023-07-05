import { atom, DefaultValue, selectorFamily } from "recoil";

export type WeeklyGoal = {
  id?: string;
  text: string;
  completed: boolean;
  weekStart: string; // represents the first day of a week in the format 'yyyy-mm-dd'
  userId: string | null;
};

interface WeeklyGoalState {
  [weekStart: string]: WeeklyGoal[];
}

export const weeklyGoalState = atom<WeeklyGoalState>({
  key: "weeklyGoalState",
  default: {},
});

export const weeklyGoalListState = selectorFamily<WeeklyGoal[], string>({
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
