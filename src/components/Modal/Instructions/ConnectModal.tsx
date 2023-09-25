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

const ConnectModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Deepen Your Connections!</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text fontWeight="bold" mb={2}>
          1. Share and Discover Goals:
        </Text>
        <Text mb={4}>
          Connect with peers to mutually share and learn about each other&apos;s
          aspirations and progress.
        </Text>

        <Text fontWeight="bold" mb={2}>
          2. Engage with KaiKul Buddies:
        </Text>
        <Text mb={4}>
          Explore buddy cards, invite friends, or select someone from our
          community. Send and receive connection messages to enrich your
          journey.
        </Text>

        {/* <Text fontWeight="bold" mb={2}>
          3. Collaborative Activities:
        </Text>
        <Text mb={4}>
          Manage your buddy list, view requests, and dive into team activities
          for a holistic collaboration experience.
        </Text> */}
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button onClick={onClose}>Start Connecting</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ConnectModal;
