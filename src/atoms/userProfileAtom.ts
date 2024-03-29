import { atom } from "recoil";

export type UserProfile = {
  userId: string;
  domains: string[];
  biggestGoal: string;
  challenges: string;
  buddyOrSolo: "buddy" | "solo";
  selfIntroduction: string;
  leaderboardParticipation: boolean;
  bio: string;
  domainsDepth: string;
  biggestGoalDepth: string;
  challengesDepth: string;
};

export const userProfileState = atom<UserProfile>({
  key: "userProfileState",
  default: {
    userId: "",
    domains: [],
    biggestGoal: "",
    challenges: "",
    buddyOrSolo: "buddy",
    selfIntroduction: "",
    leaderboardParticipation: true,
    bio: "",
    domainsDepth: "",
    biggestGoalDepth: "",
    challengesDepth: "",
  },
});

export const buddyUserProfilesAtom = atom({
  key: "buddyUserProfilesAtom",
  default: [],
});
