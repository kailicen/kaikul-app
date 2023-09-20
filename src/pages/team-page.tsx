import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import {
  Center,
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  Flex,
  Avatar,
  Textarea,
  Button,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSingleTeamTab } from "@/hooks/useSingleWeeklyReflection";
import { endOfWeek, format, startOfWeek } from "date-fns";
import LoadingScreen from "@/components/LoadingScreen";
import { collection, getDocs, query, where } from "firebase/firestore";
import { InfoOutlineIcon } from "@chakra-ui/icons";

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

type Props = {};

function TeamPage({}: Props) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { buddyId: buddyIdQuery } = router.query;
  const buddyId = Array.isArray(buddyIdQuery) ? buddyIdQuery[0] : buddyIdQuery;
  const startOfWeekString = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );

  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const formattedStartOfWeek = format(start, "MMM do -");
  const formattedEndOfWeek = format(end, "MMM do, yyyy");

  const { teamTab: userTab, handleAddDiscussion } = useSingleTeamTab(
    user?.uid || "",
    startOfWeekString
  );
  const { teamTab: buddyTab } = useSingleTeamTab(
    buddyId || "",
    startOfWeekString
  );

  const [buddyDisplayName, setBuddyDisplayName] = useState<string>("");
  const [buddyEmail, setBuddyEmail] = useState<string>("");
  const [buddyPhotoURL, setBuddyPhotoURL] = useState<string>("");

  const [userDiscussion, setUserDiscussion] = useState<string>("");
  const [buddyDiscussion, setBuddyDiscussion] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);

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
    // Fetch the buddy's information here
    const fetchBuddyInfo = async () => {
      try {
        const q = query(
          collection(firestore, "users"),
          where("uid", "==", buddyId)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const buddyData = doc.data();
          setBuddyDisplayName(buddyData.displayName);
          setBuddyEmail(buddyData.email);
          setBuddyPhotoURL(buddyData.photoURL);
        });
      } catch (error) {
        console.error(`Failed to fetch buddy's information:`, error);
      }
    };

    fetchBuddyInfo();
  }, [buddyId]);

  // If Firebase auth or buddyId is not ready, show a loading indicator or return null
  if (loading || !buddyId || !user) {
    return <LoadingScreen />; // replace with your loading indicator if needed
  }

  return (
    <>
      <AuthenticatedHeader user={user} />
      <Center>
        <Box p={5} pt="100px" w="1200px">
          <Center display="flex" flexDirection="column" gap={2}>
            <Flex alignItems="center" gap={2}>
              <Heading fontSize="lg">Weekly Updates with your Buddy</Heading>
              <Tooltip
                label="Share your weekly progress and catch up with your buddy."
                bg="gray.800"
                color="white"
                fontSize="sm"
                borderRadius="md"
                p={2}
              >
                <Icon as={InfoOutlineIcon} boxSize={4} color="purple" />
              </Tooltip>
            </Flex>
            <Text>
              {formattedStartOfWeek} {formattedEndOfWeek}
            </Text>
          </Center>
          <Grid templateColumns="repeat(6, 1fr)" gap={6}>
            {[userTab, buddyTab].map((teamTab, index) => (
              <React.Fragment key={index}>
                <GridItem colSpan={3}>
                  <Box
                    mt={5}
                    p={4}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                  >
                    {/* Display buddy's information */}
                    {index === 1 && (
                      <>
                        <UserInfo
                          displayName={buddyDisplayName}
                          email={buddyEmail}
                          photoURL={buddyPhotoURL}
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
            <GridItem colSpan={3}>
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
            <GridItem colSpan={3}>
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
    </>
  );
}

export default TeamPage;
