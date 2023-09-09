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
          Self-Discovery Modules:
        </Text>
        <Text mb={4}>
          Explore modules on core values, strengths, role models, and more, all
          designed to foster personal growth.
        </Text>

        <Text mt={3}>Stay tuned for more enriching content.</Text>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button onClick={onClose}>Start Discovering</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default SelfDiscoveryModal;
