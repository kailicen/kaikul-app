import React from "react";
import { Box, Grid, VStack } from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import MyJourneyCard from "./MyJourneyCard";
import MyStatsCard from "./MyStatsCard";

type Props = {
  profile: UserProfile;
  onEdit: (updatedProfile: UserProfile) => void;
};

const MyJourney: React.FC<Props> = ({ profile, onEdit }) => {
  return (
    <VStack alignItems="center">
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={4}
        maxW="1200px"
      >
        <MyJourneyCard profile={profile} onEdit={onEdit} />
        <MyStatsCard />
      </Grid>
    </VStack>
  );
};

export default MyJourney;
