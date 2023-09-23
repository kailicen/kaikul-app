// pages/activity.tsx

import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Avatar,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useNotifications } from "@/hooks/useNotifications";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import LoadingScreen from "@/components/LoadingScreen";

const Activity: NextPage = () => {
  const [user] = useAuthState(auth);
  const { buddyRequests } = useNotifications(user);

  return (
    <>
      <AuthenticatedHeader user={user} />
      {user ? (
        <div className="pt-[80px] container mx-auto">
          <VStack spacing={4} align="start">
            <Heading size="lg">Activity</Heading>

            {buddyRequests.length === 0 ? (
              <Text>No new notifications.</Text>
            ) : (
              <List spacing={3}>
                {buddyRequests.map((request, index) => (
                  <ListItem key={index}>
                    <HStack spacing={3}>
                      <Avatar
                        src={request.fromUserPhotoURL}
                        size="sm"
                        name={
                          request.fromUserDisplayName || request.fromUserEmail
                        }
                      />
                      <Box>
                        <Text fontSize="sm">
                          {request.fromUserDisplayName || request.fromUserEmail}{" "}
                          sent you a buddy request.
                        </Text>
                        {/* Add more details or actions related to the request if necessary */}
                      </Box>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            )}
          </VStack>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default Activity;
