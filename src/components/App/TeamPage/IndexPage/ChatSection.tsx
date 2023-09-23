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
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import { Buddy } from "@/atoms/buddyAtom";
import { IoMdSend } from "react-icons/io";

const getChatId = (user1: string, user2: string) => {
  return [user1, user2].sort().join("_");
};

type Message = {
  id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: any;
};

type Props = {
  user: User;
  buddy: Buddy | null;
};

const ChatSection: React.FC<Props> = ({ user, buddy }) => {
  const [messages, setMessages] = useState<Message[]>([]);
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

  useEffect(() => {
    if (buddy && user) {
      const chatId = getChatId(user.uid, buddy.id);

      const messagesQuery = query(
        collection(firestore, "messages"),
        where("chatId", "==", chatId),
        orderBy("timestamp", "desc"),
        limit(10)
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<Message, "id">),
          id: doc.id,
        }));
        setMessages(messages);
      });

      return () => unsubscribe();
    }
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

  return (
    <VStack spacing={4} w="100%" h="500px" bg={chatBg}>
      <Box
        overflowY="auto"
        flexGrow={1}
        w="full"
        display="flex"
        flexDirection="column-reverse"
        gap={2}
        p={4}
      >
        {messages.reverse().map((msg) => (
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
