import { UserProfile } from "@/atoms/userProfileAtom";
import { Avatar, Box, Text, VStack, Heading } from "@chakra-ui/react";
import React from "react";

type Props = {
  userProfile: UserProfile & {
    displayName?: string;
    photoURL?: string;
    email?: string;
  };
};

function BuddyProfileCard({ userProfile }: Props) {
  return (
    <Box border="1px" borderRadius="md" p={4} w="100%">
      <VStack alignItems="start" spacing={4}>
        <VStack alignItems="center" spacing={2}>
          <Avatar
            src={userProfile.photoURL || ""}
            name={userProfile.displayName || "User"}
            size="lg"
          />
          <Heading size="sm">{userProfile.displayName}</Heading>
          <Text color="gray.500">{userProfile.email}</Text>
        </VStack>
        <Text fontWeight="bold">Domains:</Text>
        <Text>{userProfile.domains.join(", ")}</Text>
        <Text fontWeight="bold">Biggest Goal:</Text>
        <Text>{userProfile.biggestGoal}</Text>
        <Text fontWeight="bold">Challenges:</Text>
        <Text>{userProfile.challenges}</Text>
        <Text fontWeight="bold">Self Introduction:</Text>
        <Text>{userProfile.selfIntroduction}</Text>
      </VStack>
    </Box>
  );
}

export default BuddyProfileCard;
