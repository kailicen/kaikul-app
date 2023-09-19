// CompleteMePage.tsx
import { Text, Button, useToast, Flex, Link } from "@chakra-ui/react";
import { OnboardingStepProps } from "./OnboardingStep1";
import { useUserProfile } from "@/hooks/useUserProfile";
import SlackShareButton from "../SlackShareButton";

function CompleteMePage({
  onNext,
  onPrevious,
  onClose,
  user,
  stepNumber,
  loading,
}: OnboardingStepProps) {
  const toast = useToast();
  const { profile } = useUserProfile(user);

  return (
    <div>
      <Text mb={4}>Ready to connect with like-minded individuals? 🚀</Text>
      <Text>
        While we&apos;re developing our in-app community, we&apos;re using Slack
        for now. Join us there!
      </Text>
      <Flex mt={4} ml={2} gap={2}>
        <SlackShareButton
          profile={profile}
          user={user}
          channel="#find-your-buddy"
        />
        <Button
          as={Link}
          href="https://join.slack.com/t/kaikul/shared_invite/zt-22ty7x0ps-89ruM2VXwB1v49yY35cYdw"
          isExternal
          _hover={{
            textDecoration: "none",
            bg: "#5140BD",
          }}
        >
          Join KaiKul Slack
        </Button>
      </Flex>
      <Flex my={7} justify="flex-end">
        <Button variant="ghost" onClick={onClose} mr={2}>
          Continue Later
        </Button>
        {stepNumber !== 1 && (
          <Button variant="outline" onClick={onPrevious} mr={2}>
            Previous
          </Button>
        )}
        <Button
          isLoading={loading}
          type={stepNumber === 3 ? "button" : "submit"}
          onClick={stepNumber === 3 ? onNext : undefined}
          mr={2}
        >
          {stepNumber === 3 ? "Done" : "Next Step"}
        </Button>
      </Flex>
    </div>
  );
}

export default CompleteMePage;
