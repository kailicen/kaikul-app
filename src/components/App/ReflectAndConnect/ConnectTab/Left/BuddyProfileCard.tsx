import { UserProfile } from "@/atoms/userProfileAtom";
import { UserInfo } from "@/pages/team-page";
import {
  Avatar,
  Box,
  Text,
  VStack,
  Heading,
  Button,
  Stack,
  useColorMode,
  Flex,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  userProfile: UserProfile & {
    displayName?: string;
    photoURL?: string;
    email?: string;
  };
  w?: string | string[];
  mb?: number;
};

function BuddyProfileCard({ userProfile, w, mb }: Props) {
  const { colorMode } = useColorMode();

  return (
    <Box
      border="1px"
      borderRadius="md"
      p={4}
      w={w || "full"}
      mb={mb}
      boxShadow="lg"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      bg={colorMode === "light" ? "white" : "gray.700"}
    >
      <VStack alignItems="start" spacing={4}>
        <UserInfo
          displayName={userProfile.displayName}
          email={userProfile.email}
          photoURL={userProfile.photoURL}
        />

        {userProfile.selfIntroduction && (
          <Text>{userProfile.selfIntroduction}</Text>
        )}

        <Text fontWeight="bold">Domains:</Text>
        <Text>{userProfile.domains.join(", ")}</Text>

        <Text fontWeight="bold">Biggest Goal:</Text>
        <Text>{userProfile.biggestGoal}</Text>

        <Text fontWeight="bold">Challenges:</Text>
        <Text>{userProfile.challenges}</Text>

        <Flex
          direction="row"
          mt={1}
          justifyContent="space-between"
          width="100%"
        >
          <Button variant="outline">Maybe Later</Button>
          <Button variant="solid">Connect</Button>
        </Flex>
      </VStack>
    </Box>
  );
}

export default BuddyProfileCard;
