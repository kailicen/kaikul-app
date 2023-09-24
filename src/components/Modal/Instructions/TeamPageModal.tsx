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

const TeamPageModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Team Dynamics at a Glance!</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text fontWeight="bold" mb={2}>
          1. Team Insights:
        </Text>
        <Text mb={4}>
          Explore life goals, challenges, and strengthen bonds through mutual
          understanding.
        </Text>

        <Text fontWeight="bold" mb={2}>
          2. Real-time Conversations:
        </Text>
        <Text mb={4}>
          Chat with members to exchange valuable insights and experiences.
        </Text>

        <Text fontWeight="bold" mb={2}>
          3. Structured Weekly Catch-ups:
        </Text>
        <Text mb={4}>
          Utilize our agenda-driven framework for effective weekly team updates.
        </Text>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button onClick={onClose}>Engage with Your Team</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default TeamPageModal;
