import { atom } from "recoil";

export type UserProfileAddition = {
  values: string[];
  strengths: string[];
  accountabilityMethods: string;
  roleModels: string;
  personalGrowthInvestments: string;
};

export const userProfileAdditionState = atom<UserProfileAddition>({
  key: "userProfileAdditionState",
  default: {
    values: [],
    strengths: [],
    accountabilityMethods: "",
    roleModels: "",
    personalGrowthInvestments: "",
  },
});
