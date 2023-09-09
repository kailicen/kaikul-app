import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MyJourneyModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Your Life&apos;s Journey Awaits!</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text fontWeight="bold" mb={2}>
          1. K-Points and Badges:
        </Text>
        <Text mb={4}>
          Earn K-Points and badges by completing tasks and sharing experiences.
          They mark your progress and achievements.
        </Text>

        <Text fontWeight="bold" mb={2}>
          2. Ultimate Goal and Challenges:
        </Text>
        <Text mb={4}>
          Set a clear ultimate goal and identify your challenges. Revisit to
          maintain focus and clarity in your life journey.
        </Text>

        <Text fontWeight="bold" mb={2}>
          3. My Stats:
        </Text>
        <Text mb={4}>
          Track your daily to yearly progress to understand your growth
          trajectory and stay motivated.
        </Text>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button onClick={onClose}>Start My Journey</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default MyJourneyModal;
