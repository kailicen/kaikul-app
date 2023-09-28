import { VStack } from "@chakra-ui/react";
import React from "react";
import { Grid } from "@chakra-ui/react";
import { useBuddyData } from "@/hooks/useBuddyData";
import BuddyProfileCard from "./BuddyProfileCard";

type Props = {};

function BuddyProfileContainer({}: Props) {
  const { buddyProfiles, loading } = useBuddyData();

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <VStack gap={4} align="start" w="100%">
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
        width="100%"
      >
        {buddyProfiles.map((buddyProfile, index) => (
          <BuddyProfileCard key={index} userProfile={buddyProfile} />
        ))}
      </Grid>
    </VStack>
  );
}

export default BuddyProfileContainer;
