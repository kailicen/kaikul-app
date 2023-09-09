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
  Grid,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { UserProfileAddition } from "@/atoms/userProfileAdditionAtom";
import EditSelfDiscoveryDrawer from "../Drawers/EditSelfDiscoveryDrawer";
import { InfoIcon } from "@chakra-ui/icons";
import SelfDiscoveryModal from "@/components/Modal/Instructions/SelfDiscoveryModal";
import SelfDiscoveryCard from "./SelfDiscoveryCard";

type Props = {
  profileAddition: UserProfileAddition;
  onEdit: (updatedProfileAddition: UserProfileAddition) => void;
};

function SelfDiscovery({ profileAddition, onEdit }: Props) {
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
        Catalyst Tools for My Journey{" "}
        <InfoIcon
          color="purple.500"
          onClick={handleInstructionOpen}
          mb={1}
          cursor="pointer"
        />
      </Text>
      <Text fontWeight="semibold">More to come...</Text>

      {/* Use the modal component here */}
      <SelfDiscoveryModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      />

      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
        width="100%"
      >
        <VStack gap={2}>
          <SelfDiscoveryCard
            profileAddition={profileAddition}
            onEdit={onEdit}
          />
        </VStack>
      </Grid>
    </VStack>
  );
}

export default SelfDiscovery;
