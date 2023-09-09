import { useState, useEffect } from "react";
import { VStack, Text, Box, Avatar, Badge, Flex } from "@chakra-ui/react";
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
import { TbSquareRoundedNumber1Filled } from "react-icons/tb";
import { FaTrophy } from "react-icons/fa";

interface UserData {
  id: string;
  userId: string;
  points: number;
  displayName?: string; // Adding the displayName property
  photoURL?: string; // Adding the photoURL property
}

const LeaderboardCard = () => {
  const [leaderboardData, setLeaderboardData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
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

        const userDetailsPromises = data.map((user) =>
          getDoc(doc(firestore, "users", user.userId))
        );

        const userDetails = await Promise.all(userDetailsPromises);

        const leaderboardDataWithUserDetails = data.map((user, index) => ({
          ...user,
          displayName:
            userDetails[index].data()?.displayName ||
            userDetails[index].data()?.email?.split("@")[0],
          photoURL: userDetails[index].data()?.photoURL,
        }));

        setLeaderboardData(leaderboardDataWithUserDetails);
      } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <VStack
      gap={4}
      p={{ base: 2, md: 4 }}
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="lg"
      w="100%"
    >
      <Text fontSize="lg" fontWeight="semibold">
        Leaderboard
      </Text>
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
              <Text>{user.displayName}</Text>
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
