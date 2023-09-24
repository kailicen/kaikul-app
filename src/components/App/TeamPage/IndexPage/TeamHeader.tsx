import { Buddy } from "@/atoms/buddyAtom";
import { Box, Avatar, Text, VStack } from "@chakra-ui/react";
import { User } from "firebase/auth";

type TeamHeaderProps = {
  user: User;
  buddy: Buddy;
};

const TeamHeader: React.FC<TeamHeaderProps> = ({ user, buddy }) => {
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
      <Text fontSize="xl">
        {user.displayName || user.email?.split("@")[0]} &{" "}
        {buddy?.displayName || buddy?.email.split("@")[0]}
        &apos;s Team
      </Text>
    </VStack>
  );
};

export default TeamHeader;
