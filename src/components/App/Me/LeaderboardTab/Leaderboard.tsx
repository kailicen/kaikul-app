import React from "react";
import { Grid, VStack, Text } from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import { User } from "firebase/auth";
import JourneyModeCard from "./JourneyModeCard";
import LeaderboardCard from "./LeaderboardCard";
import { useUserProfile } from "@/hooks/useUserProfile";

type Props = {
  onEdit: (updatedProfile: UserProfile) => void;
  user: User;
};

const MyJourney: React.FC<Props> = ({ onEdit, user }) => {
  const { profile } = useUserProfile(user);

  return (
    <VStack width="100%">
      {/* Journey Preference */}
      <Text fontWeight="bold" fontSize="lg" mb="2">
        {profile.buddyOrSolo === "buddy" ? "Accountability League" : "Solo"}
      </Text>

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

export default MyJourney;
