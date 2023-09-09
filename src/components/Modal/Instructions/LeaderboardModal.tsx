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

const LeaderboardModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Your Journey, Your Pace</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text fontWeight="bold" mb={2}>
          1. Journey Mode:
        </Text>
        <Text mb={4}>
          Choose to join the Accountability League or go solo. Fill in your
          preferences and start your journey. Join discussions in our{" "}
          <Link
            href="https://join.slack.com/t/kaikul/shared_invite/zt-22ty7x0ps-89ruM2VXwB1v49yY35cYdw"
            isExternal
            color="purple.500"
            fontWeight="bold"
          >
            Slack community
          </Link>
          .
        </Text>

        <Text fontWeight="bold" mb={2}>
          2. Leaderboard:
        </Text>
        <Text mb={4}>
          Discover the all-time leaders based on the K-Points they&apos;ve
          earned. See where you stand and get inspired to climb the ranks.
        </Text>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button onClick={onClose}>Join the Adventure</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default LeaderboardModal;
