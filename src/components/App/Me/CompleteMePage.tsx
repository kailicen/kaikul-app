// CompleteMePage.tsx
import { Text, Button, useToast, Flex, Link } from "@chakra-ui/react";
import { OnboardingStepProps } from "./OnboardingStep1";
import { useUserProfile } from "@/hooks/useUserProfile";

function CompleteMePage({
  onNext,
  onPrevious,
  onClose,
  user,
  stepNumber,
}: OnboardingStepProps) {
  const toast = useToast();
  const { profile } = useUserProfile(user);

  const shareProfileOnSlack = async () => {
    let text = `*Profile of ${
      user.displayName ? user.displayName : user.email
    }*\n\n`;

    if (profile.selfIntroduction) {
      text += `*Introduction*: ${profile.selfIntroduction}\n`;
    }

    if (profile.domains && profile.domains.length) {
      text += `*Domains that Drive Me*: ${(profile.domains as string[]).join(
        ", "
      )}\n`;
    }

    if (profile.biggestGoal) {
      text += `*Biggest Goal*: ${profile.biggestGoal}\n`;
    }

    if (profile.challenges) {
      text += `*Challenges*: ${profile.challenges}\n`;
    }

    try {
      const res = await fetch("/api/shareProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: "#daily-reflection-rev", // replace with your desired channel id
          text: text,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error);
      }

      // Display a success toast
      toast({
        title: "Share Successful",
        description:
          "The user's profile has been successfully shared on Slack.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      const errMsg = (error as Error).message || "An unknown error occurred";

      // Display the error message to the user with a toast
      toast({
        title: "Error",
        description: errMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Text mb={4}>Ready to connect with like-minded individuals? 🚀</Text>
      <Text>
        While we&apos;re developing our in-app community, we&apos;re using Slack
        for now. Join us there!
      </Text>
      <Button mt={4} colorScheme="purple" onClick={shareProfileOnSlack}>
        Share My Profile on Slack
      </Button>
      <Button
        as={Link}
        href="https://join.slack.com/t/kaikul/shared_invite/zt-22ty7x0ps-89ruM2VXwB1v49yY35cYdw"
        mt={4}
        ml={2}
        isExternal
        _hover={{
          textDecoration: "none",
          bg: "#5140BD",
        }}
      >
        Join KaiKul Slack
      </Button>
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
          colorScheme="blue"
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
