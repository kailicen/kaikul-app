import {
  Box,
  VStack,
  Text,
  Progress,
  Badge,
  Flex,
  Icon,
  Avatar,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { userPointsState } from "@/atoms/userPointsAtom";
import { milestones } from "@/hooks/useUserPoints";
import { useUserData } from "@/hooks/useUserData";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { IoSparkles } from "react-icons/io5";
import { InfoIcon } from "@chakra-ui/icons";
import PointSystemModal from "@/components/Modal/Instructions/PointSystemModal";
import { useState } from "react";

const MyMilestoneCard = () => {
  const [user] = useAuthState(auth);
  const [userPoints] = useRecoilState(userPointsState);
  const { username, imagePreview } = useUserData(user as User);

  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };

  const nextMilestone = milestones.find(
    (milestone) => userPoints < milestone.points
  );

  const reversedMilestones = [...milestones].reverse();

  const previousMilestone = reversedMilestones.find(
    (milestone) => userPoints >= milestone.points
  );

  const achievedMilestones = milestones.filter(
    (milestone) => userPoints >= milestone.points
  );

  const previousMilestonePoints = previousMilestone
    ? previousMilestone.points
    : 0;

  const progress = nextMilestone
    ? ((userPoints - previousMilestonePoints) /
        (nextMilestone.points - previousMilestonePoints)) *
      100
    : 100;

  return (
    <Flex
      alignItems="center"
      justifyContent="space-evenly"
      w="full"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="lg"
    >
      <Flex direction="column" alignItems="center" gap={2} p={4}>
        {imagePreview != "" ? (
          <Avatar size="xl" name={username} src={imagePreview} />
        ) : (
          <Avatar size="xl" />
        )}
        <Text fontWeight={700}>
          {user?.displayName || user?.email?.split("@")[0]}
        </Text>
        <Flex>
          <Icon as={IoSparkles} color="#ff5e0e" mr={1} />
          <Text color="gray.500">{userPoints} K-Points</Text>
        </Flex>
      </Flex>
      <Box p={4} w={{ base: "70%", md: "50%" }}>
        <VStack spacing={2}>
          <Text>
            My Badges{" "}
            <InfoIcon
              color="purple.500"
              onClick={handleInstructionOpen}
              mb={1}
              cursor="pointer"
            />
          </Text>
          {/* Use the modal component here */}
          <PointSystemModal
            isOpen={isInstructionOpen}
            onClose={handleInstructionClose}
          />

          {achievedMilestones.length > 0 ? (
            achievedMilestones.map((milestone, index) => (
              <Box key={index} display="flex" alignItems="center">
                <Badge
                  borderRadius="full"
                  px={3}
                  py={1}
                  bg={milestone.color}
                  color="white"
                >
                  {milestone.badge}
                </Badge>
                <Text ml={3} flex={1} color={milestone.color}>
                  {milestone.points} K-Points
                </Text>
              </Box>
            ))
          ) : (
            <Text color="gray.500" textAlign="center" fontSize="sm">
              No badges yet. Start achieving your tasks and goals to earn your
              first one!
            </Text>
          )}
        </VStack>

        {nextMilestone && (
          <Box mt={6}>
            <Flex alignItems="center" justifyContent="space-between" mb={2}>
              <Text color="gray.600">Next Milestone:</Text>
              <Badge colorScheme="purple">{nextMilestone.badge}</Badge>
            </Flex>
            <Progress
              value={progress}
              size="md"
              colorScheme="purple"
              borderRadius="md"
            />
            <Text mt={2} textAlign="center" color="gray.600">
              {userPoints} / {nextMilestone.points} points
            </Text>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default MyMilestoneCard;
