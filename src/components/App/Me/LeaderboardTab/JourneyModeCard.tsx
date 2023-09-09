import React from "react";
import {
  Text,
  VStack,
  Button,
  useDisclosure,
  Link,
  Flex,
  Box,
  Tag,
} from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import EditProfileDrawer from "../Drawers/EditProfileDrawer";
import { User } from "firebase/auth";
import SlackShareButton from "../SlackShareButton";

type Props = {
  profile: UserProfile;
  onEdit: (updatedProfile: UserProfile) => void;
  user: User;
};

const JourneyModeCard: React.FC<Props> = ({ profile, onEdit, user }) => {
  const {
    isOpen: isShareInfoOpen,
    onOpen: openShareInfo,
    onClose: closeShareInfo,
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
      w="full"
    >
      <Box>
        <Text fontWeight="semibold">Journey Mode:</Text>
        <Box mt={2}>
          <Tag colorScheme="purple" borderRadius="full">
            {profile.buddyOrSolo === "buddy" ? "Accountability League" : "Solo"}
          </Tag>
        </Box>
      </Box>

      {/* Only show Connect/Share Card if buddyOrSolo is "buddy" */}
      {profile.buddyOrSolo === "buddy" && (
        <Box>
          <Text fontWeight="semibold">Introduction:</Text>
          <Box
            borderLeft="2px solid #4130AC"
            pl={4}
            mt={2}
            fontStyle="italic"
            color="#4130AC"
          >
            “{profile.selfIntroduction}”
          </Box>
        </Box>
      )}
      <Box>
        <Text fontWeight="semibold">Leaderboard Participation:</Text>
        <Box mt={2}>
          <Tag colorScheme="purple" borderRadius="full">
            {profile.leaderboardParticipation ? "Participating" : "Anonymous"}
          </Tag>
        </Box>
      </Box>

      <Box>
        <Text fontWeight="semibold">Two-Word Bio:</Text>
        <Box mt={2}>
          <Tag colorScheme="purple" borderRadius="full">
            {profile.bio ? profile.bio : "Newbie Explorer"}
          </Tag>
        </Box>
      </Box>

      <Flex mt={3} gap={{ base: 1, md: 2 }}>
        <Button onClick={openShareInfo}>Edit</Button>
        <SlackShareButton
          profile={profile}
          user={user}
          channel="#daily-sprint"
        />
        <Button
          as={Link}
          href="https://join.slack.com/t/kaikul/shared_invite/zt-22ty7x0ps-89ruM2VXwB1v49yY35cYdw"
          isExternal
          _hover={{
            textDecoration: "none",
            bg: "#5140BD",
          }}
        >
          Join KaiKul Slack
        </Button>
      </Flex>

      {/* Drawers for editing */}

      <EditProfileDrawer
        isOpen={isShareInfoOpen}
        onClose={closeShareInfo}
        profile={profile}
        onSubmit={onEdit}
        mode="shareInfo"
      />
    </VStack>
  );
};

export default JourneyModeCard;
