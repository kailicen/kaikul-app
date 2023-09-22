import { UserProfile } from "@/atoms/userProfileAtom";
import { ConnectQuestionModal } from "@/components/Modal/Connect/ConnectQuestionModal";
import { UserInfo } from "@/pages/team-page";
import { Box, Text, VStack, Button, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";

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

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const handleConnectClick = () => {
    setIsOpen(true);
  };

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

        <Button variant="solid" onClick={handleConnectClick}>
          Connect
        </Button>

        <ConnectQuestionModal
          isOpen={isOpen}
          onClose={onClose}
          selectedUser={{
            uid: userProfile.userId,
            displayName: userProfile.displayName || "",
            email: userProfile.email || "",
            photoURL: userProfile.photoURL || "",
          }}
          type="sender"
        />
      </VStack>
    </Box>
  );
}

export default BuddyProfileCard;
