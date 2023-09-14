import React, { useState } from "react";
import {
  Button,
  useDisclosure,
  VStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import EditSelfDiscoveryDrawer from "../Drawers/EditSelfDiscoveryDrawer";
import { UserProfileAddition } from "@/atoms/userProfileAdditionAtom";

type Props = {
  profileAddition: UserProfileAddition;
  onEdit: (updatedProfileAddition: UserProfileAddition) => void;
};

const SelfDiscoveryCard: React.FC<Props> = ({ profileAddition, onEdit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputType, setInputType] = useState<string>("");
  const { colorMode } = useColorMode();

  const handleButtonClick = (type: string) => {
    setInputType(type);
    onOpen();
  };

  return (
    <VStack
      gap={4}
      boxShadow="lg"
      p={6}
      rounded="md"
      border="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      w="full"
      bg={colorMode === "light" ? "white" : "gray.800"}
    >
      <Text fontSize="lg" fontWeight="semibold">
        Modules
      </Text>
      <VStack spacing={3} w="100%">
        <Button w="100%" onClick={() => handleButtonClick("values")}>
          Discovering Your Core Values
        </Button>
        <Button w="100%" onClick={() => handleButtonClick("strengths")}>
          Discovering Your Strengths
        </Button>
        <Button
          w="100%"
          onClick={() => handleButtonClick("accountabilityMethods")}
        >
          Understanding Accountability
        </Button>
        <Button w="100%" onClick={() => handleButtonClick("roleModels")}>
          Recognizing Role Models
        </Button>
        <Button
          w="100%"
          onClick={() => handleButtonClick("personalGrowthInvestments")}
        >
          Investing in Personal Growth
        </Button>
      </VStack>

      {/* Drawers for editing */}
      <EditSelfDiscoveryDrawer
        isOpen={isOpen}
        onClose={onClose}
        profileAddition={profileAddition}
        onSubmit={onEdit}
        inputType={inputType}
      />
    </VStack>
  );
};

export default SelfDiscoveryCard;
