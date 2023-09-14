import React from "react";
import {
  Text,
  Button,
  useDisclosure,
  Flex,
  Box,
  VStack,
  Tag,
  TagLabel,
  useColorMode,
} from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import { useRouter } from "next/router";
import EditProfileDrawer from "../Drawers/EditProfileDrawer";

type Props = {
  profile: UserProfile;
  onEdit: (updatedProfile: UserProfile) => void;
};

const MyJourneyCard: React.FC<Props> = ({ profile, onEdit }) => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const {
    isOpen: isPersonalInfoOpen,
    onOpen: openPersonalInfo,
    onClose: closePersonalInfo,
  } = useDisclosure();

  const {
    isOpen: isPersonalInfoDepthOpen,
    onOpen: openPersonalInfoDepth,
    onClose: closePersonalInfoDepth,
  } = useDisclosure();

  return (
    <VStack
      gap={4}
      boxShadow="lg"
      p={6}
      rounded="md"
      align="start"
      border="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      bg={colorMode === "light" ? "white" : "gray.800"}
      w="100%"
    >
      <Box>
        <Text fontWeight="semibold">My Focus Domains: </Text>
        <Flex wrap="wrap">
          {profile.domains.map((domain, index) => (
            <Tag key={index} borderRadius="full" colorScheme="purple" m={1}>
              <TagLabel>{domain}</TagLabel>
            </Tag>
          ))}
        </Flex>
      </Box>
      <Box>
        <Text fontWeight="semibold">My Ultimate Goal:</Text>
        <Box
          borderLeft="2px solid #4130AC"
          pl={4}
          mt={2}
          fontStyle="italic"
          color={colorMode === "light" ? "brand.500" : "brand.100"}
          fontSize={{ base: "md", md: "lg" }}
        >
          “{profile.biggestGoal}”
        </Box>
      </Box>
      <Box>
        <Text fontWeight="semibold">My Challenges:</Text>
        <Box
          borderLeft="2px solid #ff5e0e"
          pl={4}
          mt={2}
          fontStyle="italic"
          color="#ff5e0e"
          fontSize={{ base: "md", md: "lg" }}
        >
          “{profile.challenges}”
        </Box>
      </Box>

      <Flex mt={3} gap={{ base: 1, md: 2 }}>
        <Button onClick={openPersonalInfo}>Edit</Button>
        <Button onClick={openPersonalInfoDepth}>Dive Deeper</Button>
        <Button
          onClick={() => {
            router.push("/tracker");
          }}
          bg="#ff5e0e"
        >
          Track My Goal
        </Button>
      </Flex>

      {/* Drawers for editing */}
      <EditProfileDrawer
        isOpen={isPersonalInfoOpen}
        onClose={closePersonalInfo}
        profile={profile}
        onSubmit={onEdit}
        mode="personalInfo"
      />
      <EditProfileDrawer
        isOpen={isPersonalInfoDepthOpen}
        onClose={closePersonalInfoDepth}
        profile={profile}
        onSubmit={onEdit}
        mode="personalInfoDepth"
      />
    </VStack>
  );
};

export default MyJourneyCard;
