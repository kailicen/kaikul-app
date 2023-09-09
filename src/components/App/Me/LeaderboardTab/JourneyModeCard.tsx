import React, { useState } from "react";
import {
  Text,
  VStack,
  Button,
  useDisclosure,
  Link,
  useToast,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import EditProfileDrawer from "../Drawers/EditProfileDrawer";
import { User } from "firebase/auth";
import ProfilePreviewModal from "@/components/Modal/Me/ProfilePreviewModal";

type Props = {
  profile: UserProfile;
  onEdit: (updatedProfile: UserProfile) => void;
  user: User;
};

const JourneyModeCard: React.FC<Props> = ({ profile, onEdit, user }) => {
  const toast = useToast();

  const {
    isOpen: isShareInfoOpen,
    onOpen: openShareInfo,
    onClose: closeShareInfo,
  } = useDisclosure();

  // State to control the modal's visibility
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const previewAndShareProfile = () => {
    setIsPreviewModalOpen(true);
  };

  const handleConfirmShare = async () => {
    setIsPreviewModalOpen(false); // Close the modal
    await shareProfileOnSlack(); // Continue with sharing process
  };

  const shareProfileOnSlack = async () => {
    let displayName = user.displayName ? user.displayName : user.email;

    let sections = [`🌟 *Meet ${displayName}!* 🌟\n`]; // Added \n

    if (profile.selfIntroduction) {
      sections.push(`📝 *Introduction*:\n${profile.selfIntroduction}\n`); // Added \n
    }

    if (profile.domains && profile.domains.length) {
      sections.push(
        `🚀 *Domains that Inspire Me*:\n${(profile.domains as string[]).join(
          ", "
        )}\n` // Added \n
      );
    }

    if (profile.biggestGoal) {
      sections.push(`🎯 *Ultimate Goal*:\n${profile.biggestGoal}\n`); // Added \n
    }

    if (profile.challenges) {
      sections.push(`🚧 *Challenges I'm Overcoming*:\n${profile.challenges}\n`); // Added \n
    }

    const text = sections.join("\n");

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
    <VStack
      spacing={3}
      p={4}
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="lg"
      align="start"
      w="full"
    >
      <Text fontWeight="bold" mb="2">
        Journey Mode:{" "}
        {profile.buddyOrSolo === "buddy" ? "Accountability League" : "Solo"}
      </Text>
      {/* Only show Connect/Share Card if buddyOrSolo is "buddy" */}
      {profile.buddyOrSolo === "buddy" && (
        <Flex direction="column" gap={2}>
          <Text fontWeight="semibold">Introduction: </Text>
          <Text fontWeight="normal">{profile.selfIntroduction}</Text>
        </Flex>
      )}
      <Flex mt={3} gap={{ base: 1, md: 2 }}>
        <Button onClick={openShareInfo}>Edit</Button>
        <Tooltip
          label="Your profile including your goal and challenges will be shared in the #daily-sprint channel on Slack."
          aria-label="A tooltip"
        >
          <Button onClick={previewAndShareProfile}>
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
      </Flex>

      <ProfilePreviewModal
        user={user}
        profile={profile}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onConfirm={handleConfirmShare}
      />

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
