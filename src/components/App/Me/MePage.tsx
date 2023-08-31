import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { onboardingState } from "@/atoms/onboardingAtom";
import OnboardingModal from "@/components/Modal/Me/OnboardingModal";
import { User } from "firebase/auth";
import { useUserProfile } from "@/hooks/useUserProfile";

const inspirationalMessages = [
  "Every journey starts with a single step.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Your purpose defines your path. Keep pushing!",
  // ...add more messages
];

type Props = { user: User };

function MePage({ user }: Props) {
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const { loading } = useUserProfile(user);

  const randomMessage =
    inspirationalMessages[
      Math.floor(Math.random() * inspirationalMessages.length)
    ];

  return (
    <>
      <div className="pt-[80px] px-2 md:px-10 3xl:px-32">
        <Box mt="5" mb="5">
          <Text fontSize="xl">{randomMessage}</Text>
        </Box>

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
      </div>
    </>
  );
}

export default MePage;
