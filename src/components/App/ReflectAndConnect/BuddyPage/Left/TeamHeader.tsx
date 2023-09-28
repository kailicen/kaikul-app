import { Buddy } from "@/atoms/buddyAtom";
import TeamPageModal from "@/components/Modal/Instructions/TeamPageModal";
import { InfoIcon } from "@chakra-ui/icons";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";

type TeamHeaderProps = {
  user: User;
  buddy: Buddy;
};

const TeamHeader: React.FC<TeamHeaderProps> = ({ user, buddy }) => {
  const router = useRouter();
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };

  const showWeeklyUpdatesPage = (buddyId: string) => {
    router.push(`/team/weeklyupdates?buddyId=${buddyId}`);
  };
  return (
    <HStack spacing={4} align="center" justifyItems="center">
      {/* <Box>
        <Avatar
          src={user.photoURL || ""}
          name={user.displayName || user.email?.split("@")[0] || ""}
          mr={4}
        />
        <Avatar
          src={buddy?.photoURL || ""}
          name={buddy?.displayName || buddy?.email.split("@")[0] || ""}
        />
      </Box> */}
      {/* <Text fontWeight="bold" fontSize="lg" mb="2">
        {user.displayName || user.email?.split("@")[0]} &{" "}
        {buddy?.displayName || buddy?.email.split("@")[0]}
        &apos;s Team{" "}
        <InfoIcon
          color="purple.500"
          onClick={handleInstructionOpen}
          mb={1}
          cursor="pointer"
        />
      </Text> */}
      <Button onClick={() => showWeeklyUpdatesPage(buddy.id)}>
        Structured Weekly Catch-ups
      </Button>
      {/* Use the modal component here */}
      <TeamPageModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      />
    </HStack>
  );
};

export default TeamHeader;
