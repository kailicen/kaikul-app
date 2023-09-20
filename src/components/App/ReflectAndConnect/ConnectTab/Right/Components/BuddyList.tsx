import React, { useEffect, useState } from "react";
import {
  VStack,
  Box,
  Avatar,
  Text,
  Button,
  Alert,
  AlertIcon,
  Badge,
  Flex,
  Link,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { User } from "firebase/auth";

type Buddy = {
  id: string;
  displayName: string;
  email: string;
  photoURL: string; // URL of the avatar image
};

type Props = {
  user: User;
  buddyIds: string[]; // list of buddy ids
};

const BuddyList: React.FC<Props> = ({ buddyIds, user }) => {
  const router = useRouter();
  const [buddies, setBuddies] = useState<Buddy[]>([]);

  const showTeamPage = (buddyId: string) => {
    router.push(`/team-page?buddyId=${buddyId}`);
  };

  useEffect(() => {
    const fetchBuddies = async () => {
      const buddiesPromises = buddyIds.map(async (id) => {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id,
            displayName: data.displayName,
            email: data.email,
            photoURL: data.photoURL,
          } as Buddy;
        }

        return null;
      });

      const buddies = (await Promise.all(buddiesPromises)).filter(Boolean);

      setBuddies(buddies as Buddy[]);
    };

    fetchBuddies();
  }, [buddyIds]);

  return buddies.length ? (
    <VStack spacing={2} align="stretch">
      {buddies.map((buddy) => (
        <Box
          key={buddy.id}
          py={2}
          px={3}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
        >
          <Flex alignItems="center">
            <Avatar src={buddy.photoURL} />
            <Box ml={4}>
              <Text fontSize="xl" fontWeight="semibold">
                {buddy.displayName}
              </Text>
              <Badge colorScheme="purple">{buddy.email}</Badge>
              <Button
                variant="link"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                mt={2}
                onClick={() => showTeamPage(buddy.id)}
              >
                View Team Page <ArrowForwardIcon ml={2} />
              </Button>
            </Box>
          </Flex>
        </Box>
      ))}
    </VStack>
  ) : (
    <Alert status="info">
      <AlertIcon />
      You don&apos;t have any buddies yet. Start by adding some!
    </Alert>
  );
};

export default BuddyList;
