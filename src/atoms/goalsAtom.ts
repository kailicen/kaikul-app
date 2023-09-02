import { atom } from "recoil";

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

export const weeklyGoalListState = atom<Goal[]>({
  key: "WeeklyGoalList",
  default: [],
});
