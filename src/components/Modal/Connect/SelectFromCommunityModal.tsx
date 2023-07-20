import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Input,
  Box,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  query,
  getDocs,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../../firebase/clientApp"; // Change this to your firebase config file
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

interface SelectFromCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  displayName: string | null;
  email: string;
  id: string;
}

export interface BuddyRequest {
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: any; // using any here because firebase.firestore.FieldValue.serverTimestamp() does not have a specific type
}

const SelectFromCommunityModal: React.FC<SelectFromCommunityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentUser] = useAuthState(auth);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const toast = useToast();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSendRequest = async (user: User) => {
    if (currentUser) {
      // check if user is not sending a request to themselves
      if (user.id !== currentUser.uid) {
        const buddyRequest: BuddyRequest = {
          fromUserId: currentUser.uid,
          toUserId: user.id,
          status: "pending",
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(firestore, "buddyRequests"), buddyRequest);
        // Show a message to the user that the buddy request has been sent
        toast({
          title: "Buddy request sent!",
          description: `You have successfully sent a buddy request to ${
            user.displayName ?? user.email
          }.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Show a message to the user that they cannot send a request to themselves
        toast({
          title: "Cannot send request",
          description: "You cannot send a buddy request to yourself.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(firestore, "users"));
      const querySnapshot = await getDocs(q);
      const users: User[] = querySnapshot.docs
        .map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as User)
        )
        .filter((user) => user.id !== currentUser?.uid); // exclude the current user from the users list
      setUsers(users);
      setSearchResults(users);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(users);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const results: User[] = users.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.email.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setSearchResults(results);
    }
  }, [searchTerm, users]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select from Community</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleChange}
          />
          <VStack spacing={4}>
            {searchResults.map((user, index) => (
              <Box key={index}>
                <Text>
                  {user.displayName ?? "No Name"} - {user.email}
                </Text>
                <Button onClick={() => handleSendRequest(user)}>
                  Send Request
                </Button>
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectFromCommunityModal;
