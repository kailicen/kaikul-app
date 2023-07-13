import { atom, DefaultValue, selectorFamily } from "recoil";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  date: string; // represents a date in the format 'yyyy-mm-dd'
  userId: string | null;
  goalId?: string | null; // This is the ID of the associated goal
};

interface TaskState {
  [date: string]: Task[];
}

export const taskState = atom<TaskState>({
  key: "taskState",
  default: {},
});

export const taskListState = selectorFamily<Task[], string>({
  key: "TaskList",
  get:
    (day) =>
    ({ get }) => {
      const taskStateVal = get(taskState);
      return taskStateVal[day] || [];
    },
  set:
    (day) =>
    ({ set }, newValue) => {
      set(taskState, (oldTaskState) => {
        const updatedTaskState = { ...oldTaskState };
        updatedTaskState[day] =
          newValue instanceof DefaultValue ? [] : newValue;
        return updatedTaskState;
      });
    },
});
