import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useDisclosure,
  Collapse,
  Flex,
} from "@chakra-ui/react";
import React, { useState } from "react";
import EditSelfDiscoveryDrawer from "./EditSelfDiscoveryDrawer";
import { UserProfileAddition } from "@/atoms/userProfileAdditionAtom";

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
    <Box
      boxShadow="lg"
      borderWidth="1px"
      p="6"
      rounded="md"
      w="100%"
      bg="white"
    >
      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Catalyst Tools for My Journey
      </Text>

      <VStack spacing={4} mt={4} alignItems="flex-start">
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
    </Box>
  );
}

export default SelfDiscovery;
