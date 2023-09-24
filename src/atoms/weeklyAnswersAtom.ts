import { atom } from "recoil";

export type UserDetail = {
  displayName?: string | null | undefined;
  email?: string | null | undefined;
  photoURL?: string | null | undefined;
};

export type Reaction = {
  userId: string;
  emoji: string;
  userDetails?: UserDetail | null;
  seen?: boolean;
  answerId?: string;
  theme?: string;
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
