import React from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  useDisclosure,
  Flex,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import EditProfileDrawer from "./EditProfileDrawer";
import { useRouter } from "next/router";

type Props = {
  profile: UserProfile;
  onEdit: (updatedProfile: UserProfile) => void;
};

const MyJourney: React.FC<Props> = ({ profile, onEdit }) => {
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
    <VStack spacing={6}>
      {/* Life's Journey Card */}
      <Flex alignItems="center">
        <Text fontWeight="bold" fontSize="xl" mb="2">
          My Life&apos;s Journey
        </Text>
        <Tooltip label="Your life's journey is unique and filled with purpose. Review this section daily to stay aligned with your goals and confront your challenges head-on.">
          <Icon name="info-outline" color="orange.500" mb={2} ml={2} />
        </Tooltip>
      </Flex>
      <Flex direction="column" alignItems="center">
        <Text>My Focus Domains: </Text>
        <Text
          fontSize="xl"
          color="#4130AC"
          fontWeight="bold"
          display="block"
          align="center"
        >
          {profile.domains.join(", ")}
        </Text>
      </Flex>
      <Flex direction="column" alignItems="center">
        <Text>My Ultimate Goal:</Text>
        <Text
          fontSize="xl"
          color="#4130AC"
          fontWeight="bold"
          display="block"
          align="center"
        >
          {profile.biggestGoal}
        </Text>
      </Flex>
      <Flex direction="column" alignItems="center">
        <Text>My Challenges:</Text>
        <Text
          fontSize="xl"
          color="#4130AC"
          fontWeight="bold"
          display="block"
          align="center"
        >
          {profile.challenges}
        </Text>
      </Flex>

      <Flex alignItems="center" mt={3} gap={2}>
        <Button onClick={openPersonalInfo}>Reflect & Edit</Button>
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

export default MyJourney;
