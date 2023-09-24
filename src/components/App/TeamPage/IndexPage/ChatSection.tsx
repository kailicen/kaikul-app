import React, { useState, useEffect, useRef } from "react";
import {
  VStack,
  Box,
  Text,
  Input,
  Button,
  InputRightElement,
  InputGroup,
  useColorModeValue,
  Textarea,
  Divider,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import {
  Buddy,
  Message,
  messagesAtom,
  readMessagesAtom,
  unreadMessagesAtom,
} from "@/atoms/buddyAtom";
import { IoMdSend } from "react-icons/io";
import { useRecoilState } from "recoil";

const getChatId = (user1: string, user2: string) => {
  return [user1, user2].sort().join("_");
};

type Props = {
  user: User;
  buddy: Buddy | null;
};

const ChatSection: React.FC<Props> = ({ user, buddy }) => {
  const [messages, setMessages] = useRecoilState(messagesAtom);
  const [unreadMessages, setUnreadMessages] =
    useRecoilState(unreadMessagesAtom);
  const [readMessages, setReadMessages] = useRecoilState(readMessagesAtom);
  const [newMessage, setNewMessage] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const bgMessageSender = useColorModeValue("brand.500", "brand.500");
  const bgMessageReceiver = useColorModeValue("gray.200", "gray.400");
  const chatBg = useColorModeValue("gray.100", "gray.700");

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px"; // Reset the height first
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  };

  const fetchMessages = async () => {
    if (buddy && user) {
      const chatId = getChatId(user.uid, buddy.id);

      const messagesQuery = query(
        collection(firestore, "messages"),
        where("chatId", "==", chatId),
        orderBy("timestamp", "desc"),
        limit(10)
      );

      const snapshot = await getDocs(messagesQuery);
      const fetchedMessages = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Message, "id">),
        id: doc.id,
      }));

      setMessages(fetchedMessages);

      const unreads = fetchedMessages.filter(
        (msg) => !msg.isRead && msg.receiverId === user.uid
      );
      const reads = fetchedMessages.filter(
        (msg) => msg.isRead || msg.senderId === user.uid
      );

      setUnreadMessages(unreads);
      setReadMessages(reads);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user, buddy]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buddy || !newMessage.trim()) return;

    const chatId = getChatId(user.uid, buddy.id);
    const messagesCollection = collection(firestore, "messages");
    const newMsg = {
      chatId,
      senderId: user.uid,
      receiverId: buddy.id,
      message: newMessage,
      timestamp: serverTimestamp(),
      isRead: false,
    };

    setNewMessage("");

    try {
      await addDoc(messagesCollection, newMsg);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    // Reset the height of the Textarea after sending the message
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Function to mark a message as read
  const markMessageAsRead = async (messageId?: string) => {
    if (!messageId) return;

    const docRef = doc(firestore, "messages", messageId);
    await updateDoc(docRef, {
      isRead: true,
    });
  };
  const markAllAsRead = async () => {
    const unreadMessages = messages.filter(
      (msg) => !msg.isRead && msg.receiverId === user.uid
    );

    for (const msg of unreadMessages) {
      await markMessageAsRead(msg.id);
    }
  };

  return (
    <VStack spacing={4} w="100%" minH="50vh" flexGrow={1} bg={chatBg}>
      <Button onClick={fetchMessages} mt={2} size="xs" variant="outline">
        Refresh Messages
      </Button>
      <Box
        overflowY="auto"
        flexGrow={1}
        w="full"
        display="flex"
        flexDirection="column-reverse"
        gap={2}
        p={4}
      >
        {/* Only show the divider if there are unread messages */}
        {unreadMessages.length > 0 && (
          <>
            {unreadMessages.map((msg) => (
              <Box
                key={msg.id}
                maxWidth="90%"
                p={2}
                alignSelf={
                  msg.senderId === user.uid ? "flex-end" : "flex-start"
                }
                bg={
                  msg.senderId === user.uid
                    ? bgMessageSender
                    : bgMessageReceiver
                }
                borderRadius="md"
              >
                <Text color={msg.senderId === user.uid ? "white" : "black"}>
                  {msg.message}
                </Text>
              </Box>
            ))}

            <Box
              width="100%"
              textAlign="center"
              my={2} // some margin for better separation
            >
              <Text color="gray.500">Unread Messages</Text>
              <Divider /> {/* A simple line; you can style it as needed */}
              <Button
                onClick={markAllAsRead}
                size="xs"
                mt={2}
                variant="outline"
              >
                Mark All as Read
              </Button>
            </Box>
          </>
        )}

        {readMessages.map((msg) => (
          <Box
            key={msg.id}
            maxWidth="90%"
            p={2}
            alignSelf={msg.senderId === user.uid ? "flex-end" : "flex-start"}
            bg={msg.senderId === user.uid ? bgMessageSender : bgMessageReceiver}
            borderRadius="md"
          >
            <Text color={msg.senderId === user.uid ? "white" : "black"}>
              {msg.message}
            </Text>
          </Box>
        ))}
      </Box>

      <Box width="100%" p={2}>
        <form onSubmit={sendMessage}>
          <InputGroup size="md">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              placeholder="Type a message"
              onChange={handleTextareaChange}
              onInput={handleTextareaChange} // This is for adjusting the height
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage(event);
                }
              }}
              pr="4rem" // Ensure the text doesn't go beneath the button
              boxShadow="lg"
              rows={1} // Start with 1 row
              autoCapitalize="sentences" // Optionally, capitalize first letter of sentences
            />
            <InputRightElement
              width="4rem"
              top="50%"
              transform="translateY(-50%)"
            >
              <Button size="sm" onClick={sendMessage}>
                <IoMdSend />
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>
    </VStack>
  );
};

export default ChatSection;
