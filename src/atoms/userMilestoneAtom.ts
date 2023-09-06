import { atom, selector } from "recoil";
import { weekTaskState } from "./tasksAtom";

type MilestoneStateType = {
  weeklyTaskCompletionRate: {
    percentage: number;
    achieved: boolean;
    date: string | null; // <-- Updated type here
  };
  // ... other milestones
};

export const milestonesState = atom<MilestoneStateType>({
  key: "milestonesState",
  default: {
    weeklyTaskCompletionRate: { percentage: 0, achieved: false, date: null },
    // ... other milestones
  },
});

export const weeklyTaskCompletionRateMilestone = selector({
  key: "weeklyTaskCompletionRateMilestone",
  get: ({ get }) => {
    const milestone = get(milestonesState).weeklyTaskCompletionRate;
    return milestone;
  },
  set: ({ get, set }) => {
    const weekTasks = get(weekTaskState);
    const allTasks = Object.values(weekTasks).flat();
    const completedTasks = allTasks.filter((task) => task.completed);

    const completionRate = (completedTasks.length / allTasks.length) * 100;

    set(milestonesState, (prevState) => ({
      ...prevState,
      weeklyTaskCompletionRate: {
        percentage: completionRate,
        achieved: completionRate > 80,
        date:
          completionRate > 80
            ? new Date().toISOString()
            : prevState.weeklyTaskCompletionRate.date,
      },
    }));
  },
});
