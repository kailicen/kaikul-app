import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import EditProfileDrawer from "./EditProfileDrawer";
import { useRouter } from "next/router";

type Props = {
  profile: UserProfile;
  onEdit: (updatedProfile: UserProfile) => void;
};

const UserProfileCard: React.FC<Props> = ({ profile, onEdit }) => {
  const router = useRouter();

  const {
    isOpen: isPersonalInfoOpen,
    onOpen: openPersonalInfo,
    onClose: closePersonalInfo,
  } = useDisclosure();

  const {
    isOpen: isShareInfoOpen,
    onOpen: openShareInfo,
    onClose: closeShareInfo,
  } = useDisclosure();

  const {
    isOpen: isPersonalInfoDepthOpen,
    onOpen: openPersonalInfoDepth,
    onClose: closePersonalInfoDepth,
  } = useDisclosure();

  return (
    <VStack spacing={6}>
      {/* Life's Journey Card */}
      <Box
        boxShadow="lg"
        borderWidth="1px"
        p="6"
        rounded="md"
        w="100%"
        bg="white"
      >
        <VStack align="start" spacing={4}>
          <Text fontWeight="bold" fontSize="xl" mb="2">
            My Life&apos;s Journey
          </Text>
          <Text fontWeight="semibold">
            Domains that Drive Me:{" "}
            <Text as="span" color="#4130AC" fontWeight="bold" display="block">
              {profile.domains.join(", ")}
            </Text>
          </Text>
          <Text fontWeight="semibold">
            My Ultimate Goal:{" "}
            <Text as="span" color="#4130AC" fontWeight="bold" display="block">
              {profile.biggestGoal}
            </Text>
          </Text>
          <Text fontWeight="semibold">
            Challenges that Shape Me:{" "}
            <Text as="span" color="#4130AC" fontWeight="bold" display="block">
              {profile.challenges}
            </Text>
          </Text>

          <Flex alignItems="center" mt={3} gap={2}>
            <Button onClick={openPersonalInfo}>Reflect & Edit</Button>
            <Button onClick={openPersonalInfoDepth}>Dive Deeper</Button>
            <Button
              onClick={() => {
                router.push("/tracker");
              }}
              bg="#ff5e0e"
            >
              ACTION
            </Button>
          </Flex>
        </VStack>
      </Box>

      {/* Journey Preference */}
      <Box
        boxShadow="lg"
        borderWidth="1px"
        p="6"
        rounded="md"
        w="100%"
        bg="white"
      >
        <Text fontWeight="bold" fontSize="xl" mb={4}>
          My Journey Mode:{" "}
          {profile.buddyOrSolo === "buddy" ? "Buddy Up" : "Solo"}
        </Text>

        {/* Only show Connect/Share Card if buddyOrSolo is "buddy" */}
        {profile.buddyOrSolo === "buddy" && (
          <VStack align="start" spacing={4} mb={4}>
            <HStack w="100%">
              <Text fontWeight="semibold">Introduction:</Text>
              <Text>{profile.selfIntroduction}</Text>
            </HStack>
            <HStack w="100%">
              <Text fontWeight="semibold">LinkedIn:</Text>
              <Text>{profile.linkedinURL}</Text>
            </HStack>
            <HStack w="100%">
              <Text fontWeight="semibold">Calendar:</Text>
              <Text>{profile.calendarLink}</Text>
            </HStack>
          </VStack>
        )}
        <Button onClick={openShareInfo} mt={3}>
          Edit Journey Mode
        </Button>
      </Box>

      {/* Drawers for editing */}
      <EditProfileDrawer
        isOpen={isPersonalInfoOpen}
        onClose={closePersonalInfo}
        profile={profile}
        onSubmit={onEdit}
        mode="personalInfo"
      />
      <EditProfileDrawer
        isOpen={isShareInfoOpen}
        onClose={closeShareInfo}
        profile={profile}
        onSubmit={onEdit}
        mode="shareInfo"
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

export default UserProfileCard;
