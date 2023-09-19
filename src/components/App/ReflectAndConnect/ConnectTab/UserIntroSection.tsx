import { UserProfile } from "@/atoms/userProfileAtom";
import { Text, VStack } from "@chakra-ui/react";
import React from "react";
import BuddyProfilesContainer from "./BuddyProfileContainer";

type Props = {};

function UserInfoSection({}: Props) {
  return (
    <VStack gap={4} p={6} align="start" w="100%">
      <Text mb={3}>
        By connecting with your peers, you share your goals and progress and get
        to know others goals and progress. The idea is to help each other, give
        and take.
      </Text>
      <BuddyProfilesContainer />
    </VStack>
  );
}

export default UserInfoSection;
