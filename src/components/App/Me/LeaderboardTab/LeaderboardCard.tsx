import { useState, useEffect } from "react";
import { VStack, Text, Box } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";

interface UserPoints {
  id: string;
  userId: string;
  points: number;
}

const LeaderboardCard = () => {
  const [leaderboardData, setLeaderboardData] = useState<UserPoints[]>([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const q = query(
          collection(firestore, "userPoints"),
          orderBy("points", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const data: UserPoints[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserPoints[];
        setLeaderboardData(data);
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
      w="full"
    >
      <Text fontSize="lg" fontWeight="semibold">
        Leaderboard
      </Text>
      {leaderboardData.length > 0 ? (
        leaderboardData.map((user, index) => (
          <Box key={user.id}>
            <Text>
              {index + 1}. {user.userId} - {user.points} points
            </Text>
          </Box>
        ))
      ) : (
        <Text>Loading...</Text>
      )}
    </VStack>
  );
};

export default LeaderboardCard;
