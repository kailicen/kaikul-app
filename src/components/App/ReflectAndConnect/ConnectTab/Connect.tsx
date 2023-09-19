import React, { useState } from "react";
import { Grid, VStack, Text } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import MyJourneyModal from "@/components/Modal/Instructions/MyJourneyModal";
import { User } from "firebase/auth";
import CommunityInfoSection from "./CommunityInfoSection";
import UserIntroSection from "./UserIntroSection";

type Props = { user: User };

const Connect: React.FC<Props> = ({ user }) => {
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
      <MyJourneyModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      />
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={4}
        width="100%"
      >
        <UserIntroSection />
        <CommunityInfoSection user={user} />
      </Grid>
    </VStack>
  );
};

export default Connect;
