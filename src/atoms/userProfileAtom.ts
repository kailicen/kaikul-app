import { atom } from "recoil";

export type UserProfile = {
  domains: string[];
  biggestGoal: string;
  challenges: string;
  buddyOrSolo: "buddy" | "solo";
  selfIntroduction: string;
  leaderboardParticipation: boolean;
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
    leaderboardParticipation: true,
    domainsDepth: "",
    biggestGoalDepth: "",
    challengesDepth: "",
  },
});
