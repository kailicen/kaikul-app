import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import {
  AppUser,
  BuddyRequest,
  Message,
  buddyRequestState,
} from "@/atoms/buddyAtom";
import { useRecoilState } from "recoil";
import { Reaction, WeeklyAnswer } from "@/atoms/weeklyAnswersAtom";

export const useNotifications = (user?: User | null) => {
  const [numOfNotifications, setNumOfNotifications] = useState(0);
  const [buddyRequests, setBuddyRequests] = useRecoilState(buddyRequestState);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [reactionNotifications, setReactionNotifications] = useState<
    Reaction[]
  >([]);

  const fetchBuddyRequests = () => {
    if (!user) return;
    const q = query(
      collection(firestore, "buddyRequests"),
      where("toUserId", "==", user.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BuddyRequest[];

      setBuddyRequests(fetchedRequests);
    });

    return () => {
      unsubscribe();
    };
  };

  const fetchUnreadMessages = () => {
    if (!user) return;

    const q = query(
      collection(firestore, "messages"),
      where("receiverId", "==", user.uid),
      where("isRead", "==", false)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedMessages: Message[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      // Group messages by sender
      const groupedMessages: { [key: string]: Message[] } = {};
      fetchedMessages.forEach((message) => {
        if (groupedMessages[message.senderId]) {
          groupedMessages[message.senderId].push(message);
        } else {
          groupedMessages[message.senderId] = [message];
        }
      });

      // Fetch sender details for all messages concurrently
      const consolidatedMessages = await Promise.all(
        Object.entries(groupedMessages).map(async ([senderId, messages]) => {
          const userRef = doc(firestore, "users", senderId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Take the first message in the array and attach the unread count to it
            const representativeMessage = messages[0];
            representativeMessage.unreadCount = messages.length;

            return {
              ...representativeMessage,
              senderName: userData?.displayName || userData?.email,
              senderPhotoURL: userData?.photoURL,
            };
          }

          // If the user doesn't exist, just return the first message in the array
          return messages[0];
        })
      );

      setUnreadMessages(consolidatedMessages);
    });

    return () => {
      unsubscribe();
    };
  };

  const fetchReactions = () => {
    if (!user) return;

    const q = query(
      collection(firestore, "weeklyAnswers"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      let fetchedReactions: Reaction[] = [];

      for (const documentSnapshot of snapshot.docs) {
        const weeklyAnswer = documentSnapshot.data() as WeeklyAnswer;
        const answerId = documentSnapshot.id;

        if (weeklyAnswer.reactions) {
          for (const reaction of weeklyAnswer.reactions) {
            if (!reaction.seen) {
              const userDocRef = doc(firestore, "users", reaction.userId);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const userData = userDocSnap.data() as AppUser;
                reaction.userDetails = {
                  displayName:
                    userData?.displayName || userData?.email.split("@")[0],
                  photoURL: userData?.photoURL,
                };
              }

              fetchedReactions.push({
                ...reaction,
                answerId,
                theme: weeklyAnswer.theme,
              });
            }
          }
        }
      }

      setReactionNotifications(fetchedReactions);
    });

    return () => {
      unsubscribe();
    };
  };

  useEffect(() => {
    fetchBuddyRequests();
    fetchUnreadMessages();
    fetchReactions();
  }, [user]);

  useEffect(() => {
    setNumOfNotifications(
      buddyRequests.length +
        unreadMessages.length +
        reactionNotifications.length
    );
  }, [buddyRequests, unreadMessages, reactionNotifications]);

  return {
    numOfNotifications,
    buddyRequests,
    unreadMessages,
    reactionNotifications,
  };
};
