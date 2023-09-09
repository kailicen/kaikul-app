import React from "react";
import {
  Text,
  Button,
  useDisclosure,
  Flex,
  Box,
  VStack,
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
      borderColor="gray.200"
    >
      <Box>
        <Text>My Focus Domains: </Text>
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          color="#4130AC"
          fontWeight="semibold"
          display="block"
        >
          {profile.domains.join(", ")}
        </Text>
      </Box>
      <Box>
        <Text>My Ultimate Goal:</Text>
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          color="#4130AC"
          fontWeight="semibold"
          display="block"
        >
          {profile.biggestGoal}
        </Text>
      </Box>
      <Box>
        <Text>My Challenges:</Text>
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          color="#4130AC"
          fontWeight="semibold"
          display="block"
        >
          {profile.challenges}
        </Text>
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
