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

const SelfDiscoveryModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Embark on Self-Discovery</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text fontWeight="bold" mb={2}>
          1. Weekly Theme:
        </Text>
        <Text mb={4}>
          Share and learn from others in our weekly themed exercises, a space to
          put theories into action.
        </Text>

        <Text fontWeight="bold" mb={2}>
          2. Modules:
        </Text>
        <Text mb={4}>
          Explore core values, strengths, and more through curated modules for
          personal growth.
        </Text>

        <Text mt={3}>Stay tuned for enriching content.</Text>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button onClick={onClose}>Start Discovering</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default SelfDiscoveryModal;
