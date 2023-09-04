import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
  Link,
  useToast,
  Flex,
  Grid,
  Tooltip,
} from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import EditProfileDrawer from "./EditProfileDrawer";
import { User } from "firebase/auth";

type Props = {
  profile: UserProfile;
  onEdit: (updatedProfile: UserProfile) => void;
  user: User;
};

const JourneyMode: React.FC<Props> = ({ profile, onEdit, user }) => {
  const toast = useToast();

  const {
    isOpen: isShareInfoOpen,
    onOpen: openShareInfo,
    onClose: closeShareInfo,
  } = useDisclosure();

  const shareProfileOnSlack = async () => {
    let displayName = user.displayName ? user.displayName : user.email;

    let sections = [`🌟 *Meet ${displayName}!* 🌟`];

    if (profile.selfIntroduction) {
      sections.push(`📝 *Introduction*: ${profile.selfIntroduction}`);
    }

    if (profile.domains && profile.domains.length) {
      sections.push(
        `🚀 *Domains that Inspire Me*: ${(profile.domains as string[]).join(
          ", "
        )}`
      );
    }

    if (profile.biggestGoal) {
      sections.push(`🎯 *Ultimate Goal*: ${profile.biggestGoal}`);
    }

    if (profile.challenges) {
      sections.push(`🚧 *Challenges I'm Overcoming*: ${profile.challenges}`);
    }

    const text = sections.join("\n\n");

    try {
      const res = await fetch("/api/shareProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: "#daily-sprint", // replace with your desired channel id
          text: text,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error);
      }

      // Display a success toast
      toast({
        title: "Share Successful",
        description:
          "The user's profile has been successfully shared on Slack.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      const errMsg = (error as Error).message || "An unknown error occurred";

      // Display the error message to the user with a toast
      toast({
        title: "Error",
        description: errMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={3}>
      {/* Journey Preference */}
      <Text fontWeight="bold" fontSize="lg" mb={4}>
        {profile.buddyOrSolo === "buddy" ? "Accountability League" : "Solo"}
      </Text>

      {/* Only show Connect/Share Card if buddyOrSolo is "buddy" */}
      {profile.buddyOrSolo === "buddy" && (
        <VStack spacing={4} mb={4}>
          <HStack w="100%">
            <Text fontWeight="semibold">
              Introduction:{" "}
              <Text as="span" fontWeight="normal" display="block">
                {profile.selfIntroduction}
              </Text>
            </Text>
          </HStack>
        </VStack>
      )}
      <VStack mt={3} gap={3}>
        <Button onClick={openShareInfo}>Edit</Button>
        <Tooltip
          label="Your profile will be shared in the #general channel on Slack."
          aria-label="A tooltip"
        >
          <Button onClick={shareProfileOnSlack}>
            Share My Profile on Slack
          </Button>
        </Tooltip>
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
      </VStack>

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

export default JourneyMode;
