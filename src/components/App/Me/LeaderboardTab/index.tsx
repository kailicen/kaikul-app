import React, { useState } from "react";
import { Grid, VStack, Text } from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import { User } from "firebase/auth";
import JourneyModeCard from "./JourneyModeCard";
import LeaderboardCard from "./LeaderboardCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { InfoIcon } from "@chakra-ui/icons";
import LeaderboardModal from "@/components/Modal/Instructions/LeaderboardModal";

type Props = {
  onEdit: (updatedProfile: UserProfile) => void;
  user: User;
};

const Leaderboard: React.FC<Props> = ({ onEdit, user }) => {
  const { profile } = useUserProfile(user);

  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };

  return (
    <VStack width="100%">
      {/* Journey Preference */}
      <Text fontWeight="bold" fontSize="lg" mb="2">
        {profile.buddyOrSolo === "buddy" ? "Accountability League" : "Solo"}{" "}
        <InfoIcon
          color="purple.500"
          onClick={handleInstructionOpen}
          mb={1}
          cursor="pointer"
        />
      </Text>
      {/* Use the modal component here */}
      <LeaderboardModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      />

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={4}
        width="100%"
      >
        <VStack gap={2}>
          <JourneyModeCard profile={profile} onEdit={onEdit} user={user} />
        </VStack>
        <LeaderboardCard />
      </Grid>
    </VStack>
  );
};

export default Leaderboard;
