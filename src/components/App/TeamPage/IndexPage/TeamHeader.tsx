import { Buddy } from "@/atoms/buddyAtom";
import TeamPageModal from "@/components/Modal/Instructions/TeamPageModal";
import { InfoIcon } from "@chakra-ui/icons";
import { Box, Avatar, Text, VStack } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useState } from "react";

type TeamHeaderProps = {
  user: User;
  buddy: Buddy;
};

const TeamHeader: React.FC<TeamHeaderProps> = ({ user, buddy }) => {
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };
  return (
    <VStack spacing={4} align="center">
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
      <Text fontWeight="bold" fontSize="lg" mb="2">
        {user.displayName || user.email?.split("@")[0]} &{" "}
        {buddy?.displayName || buddy?.email.split("@")[0]}
        &apos;s Team{" "}
        <InfoIcon
          color="purple.500"
          onClick={handleInstructionOpen}
          mb={1}
          cursor="pointer"
        />
      </Text>
      {/* Use the modal component here */}
      <TeamPageModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      />
    </VStack>
  );
};

export default TeamHeader;
