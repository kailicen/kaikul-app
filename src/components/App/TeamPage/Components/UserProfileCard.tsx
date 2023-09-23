import React from "react";
import {
  Text,
  Flex,
  Box,
  VStack,
  Tag,
  TagLabel,
  useColorMode,
} from "@chakra-ui/react";
import { UserInfo } from "./UserInfoComponent";
import { User } from "firebase/auth";
import { Buddy } from "@/atoms/buddyAtom";

export type UserProfile = {
  domains: string[];
  biggestGoal: string;
  challenges: string;
  selfIntroduction: string;
};

type Props = {
  profile: UserProfile;
  user?: User;
  buddy?: Buddy;
};

export const UserProfileCard: React.FC<Props> = ({ profile, user, buddy }) => {
  const { colorMode } = useColorMode();

  return (
    <VStack
      gap={4}
      boxShadow="lg"
      p={6}
      rounded="md"
      align="start"
      border="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      w="100%"
    >
      {user && (
        <UserInfo
          displayName={user.displayName}
          email={user.email}
          photoURL={user.photoURL}
        />
      )}
      {buddy && (
        <UserInfo
          displayName={buddy.displayName}
          email={buddy.email}
          photoURL={buddy.photoURL}
        />
      )}
      <Box>
        <Text fontWeight="semibold">Self Introduction:</Text>
        <Box pl={{ base: 2, md: 4 }} mt={2}>
          “{profile.selfIntroduction}”
        </Box>
      </Box>
      <Box>
        <Text fontWeight="semibold">Domains of Interest:</Text>
        <Flex wrap="wrap">
          {profile.domains.map((domain, index) => (
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
          “{profile.biggestGoal}”
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
          “{profile.challenges}”
        </Box>
      </Box>
    </VStack>
  );
};

export default UserProfileCard;
