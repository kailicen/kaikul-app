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
  Button,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { useNotifications } from "@/hooks/useNotifications";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const Activity: NextPage = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { buddyRequests, unreadMessages } = useNotifications(user);

  const showTeamPage = (buddyId: string) => {
    router.push(`/team?buddyId=${buddyId}`);
  };

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

            {unreadMessages.length === 0 ? (
              <Text>No unread messages.</Text>
            ) : (
              <List spacing={3}>
                {unreadMessages.map((msg, index) => (
                  <ListItem key={index}>
                    <HStack spacing={3}>
                      <Avatar
                        src={msg.senderPhotoURL}
                        size="sm"
                        name={msg.senderName}
                      />
                      <Box>
                        <Button
                          onClick={() => showTeamPage(msg.senderId)}
                          variant="ghost"
                          width="full"
                          textAlign="left"
                        >
                          <Text fontSize="sm">
                            {msg.senderName} sent you {msg.unreadCount}{" "}
                            message(s): {msg.message}
                          </Text>
                        </Button>
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
