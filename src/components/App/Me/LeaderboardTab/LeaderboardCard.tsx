import { useState, useEffect } from "react";
import {
  VStack,
  Text,
  Box,
  Avatar,
  Badge,
  Flex,
  IconButton,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { FaTrophy } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";

interface UserData {
  id: string;
  userId: string;
  points: number;
  displayName?: string; // Adding the displayName property
  photoURL?: string; // Adding the photoURL property
  bio?: string;
}

const LeaderboardCard = () => {
  const [leaderboardData, setLeaderboardData] = useState<UserData[]>([]);
  const { colorMode } = useColorMode();

  const fetchLeaderboardData = async () => {
    try {
      // Step 1: Fetch top 10 user points data
      const q = query(
        collection(firestore, "userPoints"),
        orderBy("points", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const data: UserData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];

      // Step 2: Fetch user details and user profiles for each user in the list
      const userDetailsPromises = data.map((user) =>
        getDoc(doc(firestore, "users", user.userId))
      );
      const userProfilesPromises = data.map((user) =>
        getDoc(doc(firestore, "userProfiles", user.userId))
      );

      const [userDetails, userProfiles] = await Promise.all([
        Promise.all(userDetailsPromises),
        Promise.all(userProfilesPromises),
      ]);

      // Step 3: Create leaderboard data with user details and filter based on participation
      const leaderboardDataWithUserDetails = data.map((user, index) => {
        const userDetailData = userDetails[index].data();
        const userProfileData = userProfiles[index].data();

        let displayName = "Anonymous";
        let photoURL = ""; // Set a default anonymous icon path
        let bio = "";

        if (userProfileData?.leaderboardParticipation) {
          // Include actual user details only if they opted in for leaderboard participation
          if (userDetailData) {
            displayName =
              userDetailData.displayName ||
              userDetailData.email?.split("@")[0] ||
              "Anonymous";
            photoURL =
              userDetailData.photoURL || "path/to/your/default/icon.png"; // Set a default icon path
            bio = userProfileData.bio || "Newbie Explorer";
          }
        }

        return {
          ...user,
          displayName,
          photoURL,
          bio,
        };
      });

      // Step 4: Update the state with the final list of users to display on the leaderboard
      setLeaderboardData(leaderboardDataWithUserDetails);
    } catch (error) {
      console.error("Error fetching leaderboard data: ", error);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(); // Calling the function on component mount
  }, []);

  return (
    <VStack
      gap={4}
      p={4}
      border="1px"
      borderRadius="md"
      boxShadow="lg"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      bg={colorMode === "light" ? "white" : "gray.800"}
      w="100%"
    >
      <Flex
        justifyContent="center"
        w="100%"
        alignItems="center"
        position="relative"
      >
        <Text fontSize="lg" fontWeight="semibold">
          Leaderboard
        </Text>
        <Button
          rightIcon={<RiRefreshLine />}
          onClick={fetchLeaderboardData}
          size="sm"
          variant="outline"
          position="absolute"
          right={0}
        >
          Refresh
        </Button>
      </Flex>
      {leaderboardData.length > 0 ? (
        leaderboardData.map((user, index) => (
          <Box
            key={user.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            w={{ base: "100%", md: "70%" }}
          >
            <Flex gap={2} alignItems="center">
              <Box
                display="flex"
                width="24px"
                height="24px"
                alignItems="center"
                justifyContent="center"
              >
                {index === 0 ? (
                  <FaTrophy color="gold" />
                ) : index === 1 ? (
                  <FaTrophy color="silver" />
                ) : index === 2 ? (
                  <FaTrophy color="#cd7f32" />
                ) : (
                  <Box
                    width="20px"
                    height="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="50%"
                    backgroundColor="gray.400"
                  >
                    <Text
                      fontFamily="monospace"
                      textColor="white"
                      fontWeight="semibold"
                    >
                      {index + 1}
                    </Text>
                  </Box>
                )}
              </Box>

              <Avatar
                size="sm"
                name={user.displayName}
                src={user.photoURL || undefined}
                mr={2}
              />
              <Flex direction="column" fontSize="9pt" align="flex-start" mr={8}>
                <Text fontWeight={700}>{user.displayName}</Text>
                <Flex>
                  <Text color="gray.500">{user.bio}</Text>
                </Flex>
              </Flex>
            </Flex>
            <Badge colorScheme="purple">{user.points} K-Points</Badge>
          </Box>
        ))
      ) : (
        <Text>Loading...</Text>
      )}
    </VStack>
  );
};

export default LeaderboardCard;
