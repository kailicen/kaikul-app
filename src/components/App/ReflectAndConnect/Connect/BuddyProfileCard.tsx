import { UserProfile } from "@/atoms/userProfileAtom";
import { UserInfo } from "@/components/App/ReflectAndConnect/BuddyPage/Left/Components/UserInfoComponent";
import { ConnectQuestionModal } from "@/components/Modal/Connect/ConnectQuestionModal";
import {
  Box,
  Text,
  VStack,
  Button,
  useColorMode,
  Flex,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import React, { useState } from "react";

type Props = {
  userProfile: UserProfile & {
    displayName?: string;
    photoURL?: string;
    email?: string;
  };
};

function BuddyProfileCard({ userProfile }: Props) {
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
          <Box>
            <Text fontWeight="semibold">Self Introduction:</Text>
            <Box pl={{ base: 2, md: 4 }} mt={2}>
              “{userProfile.selfIntroduction}”
            </Box>
          </Box>
        )}

        <Box>
          <Text fontWeight="semibold">Domains of Interest:</Text>
          <Flex wrap="wrap">
            {userProfile.domains.map((domain, index) => (
              <Tag key={index} borderRadius="full" colorScheme="purple" m={1}>
                <TagLabel>{domain}</TagLabel>
              </Tag>
            ))}
          </Flex>
        </Box>
        <Box>
          <Text fontWeight="semibold">Ultimate Goal:</Text>
          <Box
            borderLeft="2px solid #4130AC"
            pl={{ base: 2, md: 4 }}
            mt={2}
            fontStyle="italic"
            color={colorMode === "light" ? "brand.500" : "brand.100"}
          >
            “{userProfile.biggestGoal}”
          </Box>
        </Box>
        <Box>
          <Text fontWeight="semibold">Challenges:</Text>
          <Box
            borderLeft="2px solid #ff5e0e"
            pl={{ base: 2, md: 4 }}
            mt={2}
            fontStyle="italic"
            color="#ff5e0e"
          >
            “{userProfile.challenges}”
          </Box>
        </Box>

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
