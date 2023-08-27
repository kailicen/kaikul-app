import { atom } from "recoil";
import { Reflection } from "./reflectionsAtom";
import { Goal } from "./goalsAtom";
import { Task } from "./tasksAtom";

type DataStateType = {
  [key: string]: {
    tasks: Task[];
    blockers: Reflection[];
    goals: Goal[];
  };
};

export const dataAtom = atom<DataStateType>({
  key: "dataAtom",
  default: {},
});
