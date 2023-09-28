import React, { useState } from "react";
import { Grid, VStack } from "@chakra-ui/react";
import { User } from "firebase/auth";
import RightSection from "./Right";
import { Buddy } from "@/atoms/buddyAtom";
import LeftSection from "./Left";

type Props = { user: User };

const MyBuddiesTab: React.FC<Props> = ({ user }) => {
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);

  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };

  return (
    <VStack width="100%">
      {/* <Text fontWeight="bold" fontSize="lg" mb="2">
        Connect{" "}
        <InfoIcon
          color="purple.500"
          onClick={handleInstructionOpen}
          mb={1}
          cursor="pointer"
        />
      </Text>
      <ConnectModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      /> */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 3fr" }}
        gap={4}
        width="100%"
      >
        <RightSection user={user} setSelectedBuddy={setSelectedBuddy} />
        <LeftSection selectedBuddy={selectedBuddy} user={user} />
      </Grid>
    </VStack>
  );
};

export default MyBuddiesTab;
