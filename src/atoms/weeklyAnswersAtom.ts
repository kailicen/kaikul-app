import { atom } from "recoil";

export type UserDetail = {
  displayName?: string | null | undefined;
  email?: string | null | undefined;
};

export type Reaction = {
  userId: string;
  emoji: string;
  userDetails?: UserDetail | null;
};

export type WeeklyAnswer = {
  id: string;
  theme: string;
  userId: string;
  answer: string;
  displayName?: string;
  photoURL?: string;
  reactions?: Reaction[];
};

export const weeklyAnswersState = atom<WeeklyAnswer[]>({
  key: "weeklyAnswersState",
  default: [],
});
