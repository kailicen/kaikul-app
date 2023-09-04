import { atom } from "recoil";

export type UserProfile = {
  domains: string[];
  biggestGoal: string;
  challenges: string;
  buddyOrSolo: "buddy" | "solo";
  selfIntroduction: string;
  domainsDepth: string;
  biggestGoalDepth: string;
  challengesDepth: string;
};

export const userProfileState = atom<UserProfile>({
  key: "userProfileState",
  default: {
    domains: [],
    biggestGoal: "",
    challenges: "",
    buddyOrSolo: "buddy",
    selfIntroduction: "",
    domainsDepth: "",
    biggestGoalDepth: "",
    challengesDepth: "",
  },
});
