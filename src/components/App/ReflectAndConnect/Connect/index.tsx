import React, { useState } from "react";
import { VStack, Text } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";
import BuddyProfileContainer from "./BuddyProfileContainer";
import ConnectModal from "@/components/Modal/Instructions/ConnectModal";

type Props = { user: User };

const ConnectTab: React.FC<Props> = ({ user }) => {
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };

  return (
    <VStack width="100%">
      <Text fontWeight="bold" fontSize="lg" mb="2">
        Connect{" "}
        <InfoIcon
          color="purple.500"
          onClick={handleInstructionOpen}
          mb={1}
          cursor="pointer"
        />
      </Text>
      {/* Use the modal component here */}
      <ConnectModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      />

      <BuddyProfileContainer />
    </VStack>
  );
};

export default ConnectTab;
