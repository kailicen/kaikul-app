import React from "react";
import { Flex, Grid, Icon, Tooltip, VStack, Text, Box } from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import MyJourneyCard from "./MyJourneyCard";
import MyStatsCard from "./MyStatsCard";
import MyMilestoneCard from "./MyMilestoneCard";

type Props = {
  profile: UserProfile;
  onEdit: (updatedProfile: UserProfile) => void;
};

const MyJourney: React.FC<Props> = ({ profile, onEdit }) => {
  return (
    <VStack alignItems="center">
      <Flex alignItems="center">
        <Text fontWeight="bold" fontSize="lg" mb="2">
          My Life&apos;s Journey
        </Text>
        <Tooltip label="Your life's journey is unique and filled with purpose. Review this section daily to stay aligned with your goals and confront your challenges head-on.">
          <Icon name="info-outline" color="orange.500" mb={2} ml={2} />
        </Tooltip>
      </Flex>
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={4}
        maxW="1200px"
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
