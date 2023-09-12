import React, { useState } from "react";
import { Button, Tooltip, useToast } from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import { User } from "firebase/auth";
import ProfilePreviewModal from "@/components/Modal/Me/ProfilePreviewModal";
import useUserPoints from "@/hooks/useUserPoints";

type SlackShareButtonProps = {
  profile: UserProfile;
  user: User;
  channel: string; // Pass the channel as a prop to allow different channels
};

const SlackShareButton: React.FC<SlackShareButtonProps> = ({
  profile,
  user,
  channel,
}) => {
  const toast = useToast();

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const { updatePoints } = useUserPoints(user);

  const previewAndShareProfile = () => {
    setIsPreviewModalOpen(true);
  };

  const handleConfirmShare = async () => {
    setIsPreviewModalOpen(false);
    await shareProfileOnSlack();
  };

  const shareProfileOnSlack = async () => {
    let displayName = user.displayName
      ? user.displayName
      : user.email?.split("@")[0];

    let sections = [`🌟 *Meet ${displayName}!* 🌟\n`]; // Added \n

    if (profile.selfIntroduction) {
      sections.push(`*Introduction*:\n${profile.selfIntroduction}\n`); // Added \n
    }

    if (profile.domains && profile.domains.length) {
      sections.push(
        `*Domains that Inspire Me*:\n${(profile.domains as string[]).join(
          ", "
        )}\n` // Added \n
      );
    }

    if (profile.biggestGoal) {
      sections.push(`*Ultimate Goal*:\n${profile.biggestGoal}\n`); // Added \n
    }

    if (profile.challenges) {
      sections.push(`*Challenges I'm Overcoming*:\n${profile.challenges}\n`); // Added \n
    }

    const text = sections.join("\n");

    try {
      const res = await fetch("/api/shareProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: `#${channel}`, // replace with your desired channel id
          text: text,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error);
      }

      // Update user points after successful sharing
      await updatePoints(2);

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
    <>
      <Tooltip
        label="Your profile including your goal and challenges will be shared in the #daily-sprint channel on Slack."
        aria-label="A tooltip"
      >
        <Button onClick={previewAndShareProfile}>Share on Slack</Button>
      </Tooltip>

      <ProfilePreviewModal
        user={user}
        profile={profile}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onConfirm={handleConfirmShare}
      />
    </>
  );
};

export default SlackShareButton;
