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

const WeeklyUpdatesModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Enhance Collaboration with Shared Updates!</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text mb={4}>
          View weekly updates side by side, fostering an environment to discuss,
          share insights, and learn collaboratively.
        </Text>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button onClick={onClose}>Explore Weekly Insights</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default WeeklyUpdatesModal;
