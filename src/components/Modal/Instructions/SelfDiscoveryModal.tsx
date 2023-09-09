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
      <ModalHeader>Unlock Your Goals!</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text fontWeight="bold" mb={2}>
          1. Define Clearly:
        </Text>
        <Text mb={4}>
          Craft a goal that resonates deeply with your aspirations.
        </Text>

        <Text fontWeight="bold" mb={2}>
          2. Strategize:
        </Text>
        <Text mb={4}>Dissect your goal into bite-sized, actionable tasks.</Text>

        <Text fontWeight="bold" mb={2}>
          3. Be Accountable:
        </Text>
        <Text mb={4}>
          Boost success by buddying up in our{" "}
          <Link
            href="https://join.slack.com/t/kaikul/shared_invite/zt-22ty7x0ps-89ruM2VXwB1v49yY35cYdw"
            isExternal
            color="purple.500"
            fontWeight="bold"
          >
            Slack community
          </Link>
          . Share, motivate, and progress together!
        </Text>

        <Text mt={3}>
          Dive deeper with our{" "}
          <Link
            href="https://www.canva.com/design/DAFjgBVff1o/usvZl_W9dYaPGMsRV90-xg/view"
            isExternal
            color="purple.500"
            fontWeight="bold"
          >
            Goal-Setting Guide
          </Link>
          .
        </Text>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button onClick={onClose}>Ready to Go!</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default SelfDiscoveryModal;
