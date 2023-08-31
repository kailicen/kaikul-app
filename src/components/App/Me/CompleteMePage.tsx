// CompleteMePage.tsx
import { Text, Button, useToast, Flex } from "@chakra-ui/react";
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
  const { saveOnboardingStateToFirebase } = useUserProfile(user);

  // const handleFinish = async () => {
  //   try {
  //     await saveOnboardingStateToFirebase({
  //       step: "STEP2_COMPLETED",
  //       completed: true,
  //     });
  //     console.log(`Step3 saved`);
  //     onNext();
  //   } catch (error) {
  //     console.error("Error saving onboarding state to Firebase:", error);
  //     toast({
  //       title: "Error.",
  //       description:
  //         "There was a problem saving your onboarding state. Please try again later.",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const shareProfileOnSlack = async () => {
    // You might want to collect user's information or profile details that you want to share.
    const userInfo = {
      name: "John Doe", // for example
      domainOfInterest: "Career",
      goal: "Build leadership skills",
      challenges: "Time management",
    };

    const response = await fetch("/your-server-endpoint", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast({
        title: "Profile shared!",
        description:
          "Your profile has been shared in the #find-your-buddy Slack channel.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error.",
        description:
          "There was a problem sharing your profile. Please try again later.",
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
        Join our community on Slack to exchange ideas, find support, and build
        connections. Share your profile in the #find-your-buddy channel to
        kickstart your journey!
      </Text>
      <Button mt={4} colorScheme="purple" onClick={shareProfileOnSlack}>
        Share My Profile on Slack
      </Button>
      <Button mt={4} ml={2} colorScheme="purple">
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
          type={stepNumber === 3 ? "button" : "submit"} // If it's the last step, it doesn't need to submit the form
          onClick={stepNumber === 3 ? onNext : undefined} // If it's the last step, handle with onNext
          mr={2}
        >
          {stepNumber === 3 ? "Done" : "Next Step"}
        </Button>
      </Flex>
    </div>
  );
}

export default CompleteMePage;
