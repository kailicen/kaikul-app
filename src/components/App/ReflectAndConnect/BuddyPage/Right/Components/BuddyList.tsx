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
  useColorMode,
  useToken,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRecoilState } from "recoil";
import { Buddy, buddyListState } from "@/atoms/buddyAtom";

type Props = {
  buddyIds: string[]; // list of buddy ids
  setSelectedBuddy: (buddy: Buddy | null) => void;
};

const BuddyList: React.FC<Props> = ({ buddyIds, setSelectedBuddy }) => {
  const [buddies, setBuddies] = useRecoilState(buddyListState);
  const [activeBuddy, setActiveBuddy] = useState<string | null>(
    buddyIds.length > 0 ? buddyIds[0] : null
  );

  const { colorMode } = useColorMode();
  const [bgLightMode, bgDarkMode] = useToken("colors", ["white", "gray.800"]);
  const bg = colorMode === "light" ? bgLightMode : bgDarkMode;
  const hoverColor = colorMode === "light" ? "gray.100" : "gray.700";

  const showDetails = (buddyId: string) => {
    const selectedBuddyData = buddies.find((buddy) => buddy.id === buddyId);
    setSelectedBuddy(selectedBuddyData || null);
    setActiveBuddy(buddyId);
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

      const fetchedBuddies = (await Promise.all(buddiesPromises)).filter(
        Boolean
      );

      setBuddies(fetchedBuddies as Buddy[]);

      // Set the default buddy to the first one if available
      // Filter out null values first
      const validBuddies = fetchedBuddies.filter(Boolean) as Buddy[];

      // Set the default buddy to the first one if available
      if (validBuddies.length > 0) {
        setSelectedBuddy(validBuddies[0]);
        setActiveBuddy(validBuddies[0].id); // This line sets the first buddy as the active buddy
      }
    };

    fetchBuddies();
  }, [buddyIds]);

  return buddies.length ? (
    <VStack spacing={4} align="stretch">
      {buddies.map((buddy) => (
        <Box
          key={buddy.id}
          py={2}
          px={4}
          shadow={buddy.id === activeBuddy ? "lg" : "md"}
          borderWidth="1px"
          borderRadius="md"
          bgColor={buddy.id === activeBuddy ? hoverColor : bg}
          transition="background-color 0.3s"
          _hover={{ bgColor: hoverColor }}
          cursor="pointer"
          onClick={() => showDetails(buddy.id)}
        >
          <Flex alignItems="center">
            <Avatar
              src={buddy.photoURL || "path_to_fallback_image"}
              name={buddy.displayName}
            />
            <Box ml={4}>
              <Text fontSize="xl" fontWeight="semibold">
                {buddy.displayName}
              </Text>
              <Badge colorScheme="purple" variant="subtle">
                {buddy.email}
              </Badge>
            </Box>
            <Box ml="auto">
              {" "}
              {/* This will push the icon to the end */}
              <ArrowForwardIcon w={6} h={6} color="purple.400" />
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
