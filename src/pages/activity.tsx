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
import { NotificationCard } from "@/components/App/Activity/NotificationCard";

const Activity: NextPage = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { buddyRequests, unreadMessages } = useNotifications(user);

  const redirectToConnect = () => {
    router.push("/connect");
  };

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

            {buddyRequests.length === 0 && unreadMessages.length === 0 ? (
              <Text>No new notifications.</Text>
            ) : (
              <VStack spacing={4} w="full">
                {buddyRequests.map((request, index) => (
                  <NotificationCard key={index} onClick={redirectToConnect}>
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
                      </Box>
                    </HStack>
                  </NotificationCard>
                ))}

                {unreadMessages.map((msg, index) => (
                  <NotificationCard
                    key={index}
                    onClick={() => showTeamPage(msg.senderId)}
                  >
                    <HStack spacing={3}>
                      <Avatar
                        src={msg.senderPhotoURL}
                        size="sm"
                        name={msg.senderName}
                      />
                      <Box>
                        <Text fontSize="sm">
                          {msg.senderName} sent you {msg.unreadCount}{" "}
                          message(s): {msg.message}
                        </Text>
                      </Box>
                    </HStack>
                  </NotificationCard>
                ))}
              </VStack>
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
