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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { NotificationCard } from "@/components/App/Activity/NotificationCard";
import { Reaction } from "@/atoms/weeklyAnswersAtom";
import { useEffect, useState } from "react";
import FloatingFeedbackButton from "@/components/App/FloatingFeedbackButton";

const Activity: NextPage = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const {
    buddyRequests,
    numOfNotifications,
    reactionNotifications,
    unreadMessages,
  } = useNotifications(user);
  const [localReactions, setLocalReactions] = useState<Reaction[]>(
    reactionNotifications
  );

  useEffect(() => {
    setLocalReactions(reactionNotifications);
    console.log(reactionNotifications);
  }, [reactionNotifications]);

  const redirectToConnect = () => {
    router.push("/connect");
  };

  const showTeamPage = (buddyId: string) => {
    router.push(`/team?buddyId=${buddyId}`);
  };

  const markReactionAsSeen = async (answerId: string, reaction: Reaction) => {
    // Optimistically remove the clicked reaction from local state
    setLocalReactions((prevReactions) =>
      prevReactions.filter(
        (r) => r.userId !== reaction.userId || r.emoji !== reaction.emoji
      )
    );

    const answerRef = doc(firestore, "weeklyAnswers", answerId);
    const answerDoc = await getDoc(answerRef);
    if (answerDoc.exists()) {
      const existingReactions: Reaction[] = answerDoc.data()?.reactions || [];
      const updatedReactions = existingReactions.map((r) => {
        if (r.userId === reaction.userId && r.emoji === reaction.emoji) {
          return { ...r, seen: true };
        }
        return r;
      });
      await updateDoc(answerRef, { reactions: updatedReactions });
    }
  };

  return (
    <>
      <AuthenticatedHeader user={user} />
      {user ? (
        <div className="pt-[80px] container mx-auto px-4 md:px-8 lg:max-w-4xl">
          <VStack spacing={4} align="start">
            <Heading size="lg">Activity</Heading>

            {numOfNotifications === 0 ? (
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

                {localReactions.map((reaction, index) => (
                  <NotificationCard
                    key={index}
                    onClick={() => {
                      markReactionAsSeen(reaction.answerId as string, reaction);
                    }}
                  >
                    <HStack spacing={3}>
                      <Avatar
                        src={reaction.userDetails?.photoURL || ""}
                        size="sm"
                        name={
                          reaction.userDetails?.displayName ||
                          reaction.userDetails?.email ||
                          ""
                        }
                      />
                      <Box>
                        <Text fontSize="sm">
                          {reaction.userDetails?.displayName ||
                            reaction.userDetails?.email}{" "}
                          reacted to your answer on &quot;{reaction.theme}&quot;
                          with {reaction.emoji}
                        </Text>
                      </Box>
                    </HStack>
                  </NotificationCard>
                ))}
              </VStack>
            )}
          </VStack>
          <FloatingFeedbackButton /> {/* Add the feedback button */}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default Activity;
