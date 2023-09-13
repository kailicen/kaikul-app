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
  Avatar,
  Flex,
} from "@chakra-ui/react";
import {
  collection,
  query,
  getDocs,
  serverTimestamp,
  addDoc,
  updateDoc,
  getDoc,
  doc,
  orderBy,
  limit,
  startAfter,
  where,
} from "firebase/firestore";
import { auth, firestore } from "../../../firebase/clientApp"; // Change this to your firebase config file
import { useAuthState } from "react-firebase-hooks/auth";
import { BuddyRequest, buddyRequestState } from "@/atoms/buddyRequestsAtom";
import { useRecoilValue } from "recoil";

interface SelectFromCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  buddies?: string[]; // Here the '?' means buddies is an optional property
  [key: string]: any; // This is for all other properties
}

const SelectFromCommunityModal: React.FC<SelectFromCommunityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const buddyRequests = useRecoilValue(buddyRequestState);
  const [user] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const toast = useToast();

  const [lastUser, setLastUser] = useState<null | User>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      if (currentUser && !isFetching) {
        setIsFetching(true);

        let q = query(
          collection(firestore, "users"),
          orderBy("displayName"), // Make sure to create an index on this field in your Firestore database
          limit(10) // you can change this limit
        );

        if (lastUser) {
          q = query(
            collection(firestore, "users"),
            orderBy("displayName"), // Maintain this order in your query to work with startAfter
            startAfter(lastUser.displayName), // Use a field that is being ordered by in your query
            limit(10)
          );
        }

        const querySnapshot = await getDocs(q);

        const newUsers: User[] = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), uid: doc.id } as User))
          .filter(
            (user) =>
              user.uid !== currentUser.uid &&
              !currentUser.buddies?.includes(user.uid)
          );

        if (newUsers.length > 0) {
          setLastUser(newUsers[newUsers.length - 1]);
        }

        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
        setSearchResults((prevResults) => [...prevResults, ...newUsers]);

        setIsFetching(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const scrollContainer = document.getElementById("scrollContainer");

    const handleScroll = () => {
      if (
        scrollContainer &&
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight - 200 &&
        !isFetching // Add a check to ensure fetchData is not currently in progress
      ) {
        fetchData(); // Call fetchData directly when nearing the bottom
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isFetching]); // Add isFetching to the dependency array

  useEffect(() => {
    fetchData(); // Initial fetch
  }, [currentUser]);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (event.target.value === "") {
      setSearchResults(users);
    } else {
      const lowerCaseSearchTerm = event.target.value.toLowerCase();
      let q = query(
        collection(firestore, "users"),
        where("displayName", ">=", lowerCaseSearchTerm),
        where("displayName", "<=", lowerCaseSearchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const newUsers: User[] = querySnapshot.docs.map(
        (doc) => ({ ...doc.data(), uid: doc.id } as User)
      );

      setSearchResults(newUsers);
    }
  };

  const handleSendRequest = async (user: User) => {
    if (currentUser) {
      // check if user is not sending a request to themselves
      if (user.uid !== currentUser.uid) {
        const buddyRequest: BuddyRequest = {
          id: "", // Firebase Firestore will auto-generate this when you add the document
          fromUserId: currentUser.uid,
          fromUserDisplayName: currentUser.displayName || "",
          fromUserEmail: currentUser.email || "",
          fromUserPhotoURL: currentUser.photoURL || "",
          toUserId: user.uid,
          status: "pending",
          timestamp: serverTimestamp(),
        };

        const docRef = await addDoc(
          collection(firestore, "buddyRequests"),
          buddyRequest
        );
        // Get the generated id from the document reference and update the buddyRequest
        await updateDoc(docRef, { id: docRef.id });

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
    // this will run when the component is loaded
    if (user) {
      const fetchUser = async () => {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ ...userDoc.data(), uid: userDoc.id } as User);
        }
      };

      fetchUser();
    }
  }, [user]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log(currentUser);
  //     if (currentUser) {
  //       const q = query(collection(firestore, "users"));
  //       const querySnapshot = await getDocs(q);
  //       const users: User[] = querySnapshot.docs
  //         .map(
  //           (doc) =>
  //             ({
  //               ...doc.data(),
  //               uid: doc.id,
  //             } as User)
  //         )
  //         .filter(
  //           (user) =>
  //             user.uid !== currentUser.uid &&
  //             !currentUser.buddies?.includes(user.uid)
  //         ); // exclude the current user and his/her buddies from the users list
  //       setUsers(users);
  //       setSearchResults(users);
  //     }
  //   };

  //   fetchData();
  // }, [currentUser]);

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(users);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const results: User[] = users.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.email?.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setSearchResults(results);
    }
  }, [searchTerm]);

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
          <VStack
            id="scrollContainer"
            mt={5}
            align="start"
            spacing={5}
            h="400px" // adjust this value according to your needs
            overflowY="auto"
          >
            {searchResults.map((user, index) => (
              <Flex key={user.uid} w="100%">
                <Avatar
                  src={user.photoURL ? user.photoURL : ""}
                  size="md"
                  mr={3}
                />
                <Box flex="1">
                  <Text fontWeight="bold">{user.displayName}</Text>
                  <Text color="gray.500">{user.email}</Text>
                </Box>
                <Button onClick={() => handleSendRequest(user)}>Connect</Button>
              </Flex>
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
