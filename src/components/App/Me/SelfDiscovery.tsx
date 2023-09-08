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

type Props = {
  profileAddition: UserProfileAddition;
  onEdit: (updatedProfileAddition: UserProfileAddition) => void;
};

function SelfDiscovery({ profileAddition, onEdit }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputType, setInputType] = useState<string>("");

  const handleButtonClick = (type: string) => {
    setInputType(type);
    onOpen();
  };

  return (
    <VStack spacing={3}>
      <Flex alignItems="center">
        <Text fontWeight="bold" fontSize="lg">
          Catalyst Tools for My Journey
        </Text>
        <Tooltip label="Here are the resources and exercises that aid in self-discovery">
          <Icon name="info-outline" color="orange.500" ml={2} />
        </Tooltip>
      </Flex>

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
