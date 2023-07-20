import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, firestore } from "../../../firebase/clientApp"; // Change this to your firebase config file
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, VStack, Text, Button, useToast } from "@chakra-ui/react";
import { BuddyRequest } from "@/components/Modal/Connect/SelectFromCommunityModal";

const BuddyRequests: React.FC = () => {
  const [currentUser] = useAuthState(auth);
  const [buddyRequests, setBuddyRequests] = useState<BuddyRequest[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const q = query(
          collection(firestore, "buddyRequests"),
          where("toUserId", "==", currentUser.uid),
          where("status", "==", "pending")
        );
        const querySnapshot = await getDocs(q);
        const requests: BuddyRequest[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          fromUserId: doc.data().fromUserId,
          toUserId: doc.data().toUserId,
          status: doc.data().status,
          timestamp: doc.data().timestamp,
        })) as BuddyRequest[];

        if (requests.length > buddyRequests.length) {
          toast({
            title: "New Buddy Request",
            description: "You have a new buddy request. Please check.",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        }

        setBuddyRequests(requests);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <VStack spacing={4}>
      {buddyRequests.length > 0 ? (
        buddyRequests.map((request, index) => (
          <Box key={index}>
            <Text>Buddy Request from User ID: {request.fromUserId}</Text>
            <Button>Accept</Button>
            <Button>Reject</Button>
          </Box>
        ))
      ) : (
        <Text>No pending buddy requests.</Text>
      )}
    </VStack>
  );
};

export default BuddyRequests;
