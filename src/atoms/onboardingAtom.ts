import { atom } from "recoil";

export interface OnboardingState {
  step: "NEW" | "STEP1_COMPLETED" | "STEP2_COMPLETED" | "COMPLETED";
  completed: boolean; // New property to indicate if the entire onboarding process is complete
}

const defaultOnboardingState: OnboardingState = {
  step: "NEW",
  completed: false, // Set default to false, meaning onboarding isn't complete yet
};

export const onboardingState = atom<OnboardingState>({
  key: "onboardingState",
  default: defaultOnboardingState,
});
