import { atom } from "recoil";
import { Task } from "./tasksAtom";

export type Goal = {
  id: string;
  text: string;
  completed: boolean;
  startDate: string;
  endDate: string;
  userId: string | null;
  description?: string;
  tasks?: Task[];
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
