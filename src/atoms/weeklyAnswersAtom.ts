import { atom } from "recoil";

export type WeeklyAnswer = {
  theme: string;
  userId: string;
  answer: string;
  displayName?: string; // Adding displayName property
  photoURL?: string; // Adding photoURL property
};

export const weeklyAnswersState = atom<WeeklyAnswer[]>({
  key: "weeklyAnswersState",
  default: [],
});
