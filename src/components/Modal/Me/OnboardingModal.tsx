// OnboardingModal.tsx
import CompleteMePage from "@/components/App/Me/CompleteMePage";
import OnboardingStep1 from "@/components/App/Me/OnboardingStep1";
import OnboardingStep2 from "@/components/App/Me/OnboardingStep2";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { OnboardingState, onboardingState } from "@/atoms/onboardingAtom";
import { User } from "firebase/auth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState } from "react";

function OnboardingModal({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}) {
  const [isSmallerThan768] = useMediaQuery("(max-width: 767px)");
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const [loading, setLoading] = useState(false);

  const { saveOnboardingStateToFirebase } = useUserProfile(user);

  const updateAndSaveOnboardingState = async (newState: OnboardingState) => {
    await saveOnboardingStateToFirebase(newState);
    setOnboarding(newState);
  };

  const goToNextStep = async () => {
    setLoading(true);
    let newState: OnboardingState;

    switch (onboarding.step) {
      case "NEW":
        newState = { step: "STEP1_COMPLETED", completed: false };
        break;
      case "STEP1_COMPLETED":
        newState = { step: "STEP2_COMPLETED", completed: false };
        break;
      case "STEP2_COMPLETED":
        newState = { step: "COMPLETED", completed: true };
        //onClose();
        break;
      default:
        return;
    }
    await updateAndSaveOnboardingState(newState);
    setLoading(false);
  };

  const goToPreviousStep = () => {
    let newState: OnboardingState;
    switch (onboarding.step) {
      case "STEP1_COMPLETED":
        newState = { step: "NEW", completed: false };
        break;
      case "STEP2_COMPLETED":
        newState = { step: "STEP1_COMPLETED", completed: false };
        break;
      default:
        return;
    }
    updateAndSaveOnboardingState(newState);
  };

  let CurrentStep;
  let stepNumber; // For the modal title

  switch (onboarding.step) {
    case "NEW":
      stepNumber = 1;
      CurrentStep = (
        <OnboardingStep1
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          onClose={onClose}
          user={user}
          stepNumber={stepNumber}
          loading={loading}
        />
      );
      break;
    case "STEP1_COMPLETED":
      stepNumber = 2;
      CurrentStep = (
        <OnboardingStep2
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          onClose={onClose}
          user={user}
          stepNumber={stepNumber}
          loading={loading}
        />
      );
      break;
    case "STEP2_COMPLETED":
      stepNumber = 3;
      CurrentStep = (
        <CompleteMePage
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          onClose={onClose}
          user={user}
          stepNumber={stepNumber}
          loading={loading}
        />
      );
      break;
    case "COMPLETED":
      CurrentStep = null;
    default:
      CurrentStep = null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isSmallerThan768 ? "full" : "lg"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Setup Guide {`Step ${stepNumber}/3`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{CurrentStep}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default OnboardingModal;
