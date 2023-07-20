import React from "react";
import { Box, Button, Divider, VStack } from "@chakra-ui/react";
import AddBuddy from "./AddBuddy";
import BuddyRequests from "./BuddyRequests";

type Props = {};

// Placeholder components for the functionalities
const Reflections = () => (
  <Box bg="gray.200" h="200px" w="full">
    Reflections
  </Box>
);
const Discussions = () => (
  <Box bg="gray.300" h="200px" w="full">
    Discussions
  </Box>
);
const MeetingScheduler = () => (
  <Box bg="gray.400" h="200px" w="full">
    Meeting Scheduler
  </Box>
);

function Connect({}: Props) {
  return (
    <VStack spacing={4}>
      <AddBuddy />
      <BuddyRequests />
      <Reflections />
      <Discussions />
      <MeetingScheduler />
    </VStack>
  );
}

export default Connect;
