import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useDisclosure,
  Collapse,
  Flex,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { UserProfileAddition } from "@/atoms/userProfileAdditionAtom";
import EditSelfDiscoveryDrawer from "./Drawers/EditSelfDiscoveryDrawer";
import { InfoIcon } from "@chakra-ui/icons";
import SelfDiscoveryModal from "@/components/Modal/Instructions/SelfDiscoveryModal";

type Props = {
  profileAddition: UserProfileAddition;
  onEdit: (updatedProfileAddition: UserProfileAddition) => void;
};

function SelfDiscovery({ profileAddition, onEdit }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputType, setInputType] = useState<string>("");

  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };

  const handleButtonClick = (type: string) => {
    setInputType(type);
    onOpen();
  };

  return (
    <VStack spacing={3}>
      <Text fontWeight="bold" fontSize="lg" mb="2">
        Catalyst Tools for My Journey
        <InfoIcon
          color="purple.500"
          onClick={handleInstructionOpen}
          mb={1}
          cursor="pointer"
        />
      </Text>
      {/* Use the modal component here */}
      <SelfDiscoveryModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      />

      <VStack spacing={3} mt={4}>
        <Button onClick={() => handleButtonClick("values")}>
          Discovering Your Core Values
        </Button>
        <Button onClick={() => handleButtonClick("strengths")}>
          Discovering Your Strengths
        </Button>
        <Button onClick={() => handleButtonClick("accountabilityMethods")}>
          Understanding Accountability
        </Button>
        <Button onClick={() => handleButtonClick("roleModels")}>
          Recognizing Role Models
        </Button>
        <Button onClick={() => handleButtonClick("personalGrowthInvestments")}>
          Investing in Personal Growth
        </Button>
      </VStack>

      <EditSelfDiscoveryDrawer
        isOpen={isOpen}
        onClose={onClose}
        profileAddition={profileAddition}
        onSubmit={onEdit}
        inputType={inputType}
      />
    </VStack>
  );
}

export default SelfDiscovery;
