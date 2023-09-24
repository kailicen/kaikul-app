import React, { useEffect, useState } from "react";
import {
  Center,
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  Flex,
  Textarea,
  Button,
  Tooltip,
  Icon,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { ArrowBackIcon, InfoIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";
import { Buddy } from "@/atoms/buddyAtom";
import { useRouter } from "next/router";
import { IoChevronBack } from "react-icons/io5";
import WeeklyUpdatesModal from "@/components/Modal/Instructions/WeeklyUpdatesModal";
import { UserInfo } from "../Components/UserInfoComponent";
import { useSingleWeeklyReflection } from "@/hooks/useSingleWeeklyReflection";
import { useBuddyData } from "@/hooks/useBuddyData";

type Props = {
  user: User;
  buddyId: string;
};

function WeeklyUpdatesShare({ user, buddyId }: Props) {
  const startOfWeekString = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );

  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const formattedStartOfWeek = format(start, "MMM do -");
  const formattedEndOfWeek = format(end, "MMM do, yyyy");

  const { teamTab: userTab, handleAddDiscussion } = useSingleWeeklyReflection(
    user?.uid || "",
    startOfWeekString
  );
  const { teamTab: buddyTab } = useSingleWeeklyReflection(
    buddyId || "",
    startOfWeekString
  );

  const { fetchBuddyById } = useBuddyData();
  const [buddy, setBuddy] = useState<Buddy | null>(null);

  const [userDiscussion, setUserDiscussion] = useState<string>("");
  const [buddyDiscussion, setBuddyDiscussion] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();

  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };

  const showTeamPage = (buddyId: string) => {
    router.push(`/team?buddyId=${buddyId}`);
  };

  const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });

  const handleUserDiscussionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUserDiscussion(event.target.value);

    // Check if the Textarea has content, and if so, switch to edit mode
    if (event.target.value.trim() !== "") {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  };

  useEffect(() => {
    if (userTab[0]?.discussion) {
      setUserDiscussion(userTab[0].discussion);
    }
  }, [userTab]);

  useEffect(() => {
    if (buddyTab[0]?.discussion) {
      setBuddyDiscussion(buddyTab[0].discussion);
    }
  }, [buddyTab]);

  useEffect(() => {
    // Fetch buddy data when component mounts or buddyId changes
    const fetchBuddyData = async () => {
      if (buddyId) {
        const fetchedBuddy = await fetchBuddyById(buddyId);
        if (fetchedBuddy) {
          setBuddy(fetchedBuddy);
        }
      }
    };

    fetchBuddyData();
  }, [buddyId, fetchBuddyById]);

  return (
    <Center>
      <Box position="relative" w={{ base: "100%", md: "90%", lg: "1200px" }}>
        {breakpoint === "base" ? (
          <IconButton
            position="absolute"
            top={2}
            left={2}
            aria-label="Back to Team"
            icon={<ArrowBackIcon />}
            onClick={() => showTeamPage(buddyId)}
            borderRadius="full"
          />
        ) : (
          <Button
            leftIcon={<IoChevronBack />}
            variant="ghost"
            position="absolute"
            top={2}
            left={2}
            onClick={() => showTeamPage(buddyId)}
          >
            Back to Team
          </Button>
        )}
        <Center display="flex" flexDirection="column" gap={2}>
          <Flex alignItems="center" gap={2}>
            <Text fontWeight="bold" fontSize="lg" mb="2">
              Shared Weekly Updates{" "}
              <InfoIcon
                color="purple.500"
                onClick={handleInstructionOpen}
                mb={1}
                cursor="pointer"
              />
            </Text>
            {/* Use the modal component here */}
            <WeeklyUpdatesModal
              isOpen={isInstructionOpen}
              onClose={handleInstructionClose}
            />
          </Flex>
          <Text>
            {formattedStartOfWeek} {formattedEndOfWeek}
          </Text>
        </Center>
        <Grid templateColumns="repeat(6, 1fr)" gap={2} mt={4}>
          {[userTab, buddyTab].map((teamTab, index) => (
            <React.Fragment key={index}>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Box p={4} shadow="md" borderWidth="1px" borderRadius="md">
                  {/* Display buddy's information */}
                  {index === 1 && (
                    <>
                      <UserInfo
                        displayName={buddy?.displayName}
                        email={buddy?.email}
                        photoURL={buddy?.photoURL}
                      />
                    </>
                  )}
                  {/* Display user's information */}
                  {index === 0 && (
                    <>
                      <UserInfo
                        displayName={user.displayName}
                        email={user.email}
                        photoURL={user.photoURL}
                      />
                    </>
                  )}
                  <Box display="flex" alignItems="center" mt={4} gap={2}>
                    <Text fontWeight="semibold">⭐ Week Rating:</Text>
                    <Text> {teamTab[0]?.rateWeek}/10</Text>
                  </Box>
                  {/* Other data */}
                  <Box display="flex" alignItems="center" mt={4} gap={2}>
                    <Text fontWeight="semibold">😀 Happiness Rating:</Text>
                    <Text> {teamTab[0]?.rateHappiness}/10</Text>
                  </Box>
                  <Box display="flex" alignItems="center" mt={4} gap={2}>
                    <Text fontWeight="semibold">⏰ Practice Hours:</Text>
                    <Text> {teamTab[0]?.practiceHours}</Text>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1} mt={4}>
                    <Text fontWeight="semibold">😆 Biggest improvement:</Text>
                    <Text> {teamTab[0]?.biggestImprovement}</Text>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1} mt={4}>
                    <Text fontWeight="semibold">🫠 Biggest obstacle:</Text>
                    <Text> {teamTab[0]?.biggestObstacle}</Text>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1} mt={4}>
                    <Text fontWeight="semibold">🧑‍🎓 Lesson Learned:</Text>
                    <Text> {teamTab[0]?.lessonLearned}</Text>
                  </Box>
                </Box>
              </GridItem>
            </React.Fragment>
          ))}
        </Grid>
        <Grid templateColumns="repeat(6, 1fr)" gap={6} mt={6}>
          {/* Discussion boxes */}
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <Flex alignItems="center" gap={2} mb={4}>
              <Heading size="md">Discussion</Heading>
              <Tooltip
                label="Engage in meaningful discussions with your buddy. Share insights, thoughts, and anything you've learned during your catch-ups."
                bg="gray.800"
                color="white"
                fontSize="sm"
                borderRadius="md"
                p={2}
              >
                <Icon as={InfoOutlineIcon} boxSize={4} color="purple" />
              </Tooltip>
            </Flex>
            <Box mt={4}>
              {userDiscussion && !isEditMode ? (
                <>
                  <Box
                    mt={5}
                    p={4}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                  >
                    <Text>{userDiscussion}</Text>
                  </Box>
                  <Button mt={2} onClick={() => setIsEditMode(true)}>
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Textarea
                    value={userDiscussion}
                    rows={5}
                    onChange={handleUserDiscussionChange}
                    placeholder="Share your lesson learned from your buddy..."
                  />
                  <Button
                    mt={2}
                    onClick={() => {
                      handleAddDiscussion(userTab[0]?.id, userDiscussion);
                      setIsEditMode(false);
                    }}
                  >
                    Submit
                  </Button>
                </>
              )}
            </Box>
          </GridItem>

          {/* buddy discussion */}
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <Heading size="md" mb={4}>
              Discussion
            </Heading>
            <Box mt={4}>
              {buddyDiscussion && (
                <Box
                  mt={5}
                  p={4}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Text>{buddyDiscussion}</Text>
                </Box>
              )}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Center>
  );
}

export default WeeklyUpdatesShare;
