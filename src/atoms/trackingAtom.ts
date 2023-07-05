import { atom } from "recoil";
import { Blocker } from "./blockersAtom";
import { WeeklyGoal } from "./weeklyGoalsAtom";
import { Task } from "./tasksAtom";

type DataStateType = {
  [key: string]: {
    tasks: Task[];
    blockers: Blocker[];
    goals: WeeklyGoal[];
  };
};

export const dataAtom = atom<DataStateType>({
  key: "dataAtom",
  default: {},
});
