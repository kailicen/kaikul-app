import { VStack, Box, Text } from "@chakra-ui/react";

const ChatSection: React.FC = () => {
  return (
    <VStack spacing={4} w="full">
      {/* Placeholder chat messages */}
      <Box w="full" p={4} bg="gray.200" borderRadius="md">
        <Text>This is a chat message</Text>
      </Box>

      <Box w="full" p={4} bg="gray.300" borderRadius="md">
        <Text>This is another chat message</Text>
      </Box>
    </VStack>
  );
};

export default ChatSection;
