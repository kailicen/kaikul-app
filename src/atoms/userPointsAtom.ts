import { atom } from "recoil";

export const userPointsState = atom({
  key: "userPointsState",
  default: 0,
});

export const userMilestoneState = atom<string[]>({
  key: "userMilestoneState",
  default: [],
});
