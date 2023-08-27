import { atom } from "recoil";
import { Blocker } from "./blockersAtom";
import { Goal } from "./goalsAtom";
import { Task } from "./tasksAtom";

type DataStateType = {
  [key: string]: {
    tasks: Task[];
    blockers: Blocker[];
    goals: Goal[];
  };
};

export const dataAtom = atom<DataStateType>({
  key: "dataAtom",
  default: {},
});
