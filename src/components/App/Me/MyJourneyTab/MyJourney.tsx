import React, { useState } from "react";
import { Flex, Grid, Icon, Tooltip, VStack, Text, Box } from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import MyJourneyCard from "./MyJourneyCard";
import MyStatsCard from "./MyStatsCard";
import MyMilestoneCard from "./MyMilestoneCard";
import { InfoIcon } from "@chakra-ui/icons";
import MyJourneyModal from "@/components/Modal/Instructions/MyJourneyModal";

type Props = {
  profile: UserProfile;
  onEdit: (updatedProfile: UserProfile) => void;
};

const MyJourney: React.FC<Props> = ({ profile, onEdit }) => {
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
        My Life&apos;s Journey{" "}
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
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
        width="100%"
      >
        <VStack gap={2}>
          <MyMilestoneCard />
          <MyJourneyCard profile={profile} onEdit={onEdit} />
        </VStack>

        <MyStatsCard />
      </Grid>
    </VStack>
  );
};

export default MyJourney;
