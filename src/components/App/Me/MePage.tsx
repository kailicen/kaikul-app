import React from "react";
import { Grid } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { onboardingState } from "@/atoms/onboardingAtom";
import OnboardingModal from "@/components/Modal/Me/OnboardingModal";
import { User } from "firebase/auth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserProfileAddition } from "@/hooks/useUserProfileAddition";
import UserProfileCard from "./UserProfileCard";
import SelfDiscovery from "./SelfDiscovery";

type Props = { user: User };

function MePage({ user }: Props) {
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const { loading, profile, updateProfile } = useUserProfile(user);
  const { profileAddition, updateProfileAddition } =
    useUserProfileAddition(user);

  return (
    <>
      {!loading && profile && (
        <Grid templateColumns={["1fr", "1fr", "2fr 1fr"]} gap={6} w="100%">
          <UserProfileCard profile={profile} onEdit={updateProfile} />

          <SelfDiscovery
            profileAddition={profileAddition}
            onEdit={updateProfileAddition}
          />
        </Grid>
      )}

      {/* Check if onboarding is not complete, then show the modal */}
      {!loading && (
        <OnboardingModal
          isOpen={!onboarding.completed}
          onClose={() =>
            setOnboarding((prev) => ({ ...prev, completed: true }))
          }
          user={user as User}
        />
      )}
    </>
  );
}

export default MePage;
