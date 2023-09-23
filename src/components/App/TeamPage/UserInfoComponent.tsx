import { Flex, Avatar, Box, Text } from "@chakra-ui/react";

// Helper component to display user or buddy information
export const UserInfo = ({ displayName, email, photoURL }: any) => (
  <Flex w="100%" alignItems="center">
    <Avatar
      src={photoURL || ""}
      name={displayName || "User"}
      size="md"
      mr={3}
    />
    <Box flex="1">
      <Text fontWeight="bold" fontSize="md">
        {displayName || "User"}
      </Text>
      <Text color="gray.500" fontSize="sm">
        {email}
      </Text>
    </Box>
  </Flex>
);
