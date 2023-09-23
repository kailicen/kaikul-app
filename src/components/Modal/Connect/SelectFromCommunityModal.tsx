import React, { useState, ChangeEvent } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Box,
  Text,
  Avatar,
  useToast,
  InputGroup,
  InputRightElement,
  HStack,
} from "@chakra-ui/react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp"; // Change this to your firebase config file
import { ConnectQuestionModal } from "./ConnectQuestionModal";
import { SearchIcon } from "@chakra-ui/icons";
import { AppUser } from "@/atoms/buddyAtom";

interface SelectFromCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectFromCommunityModal: React.FC<SelectFromCommunityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchedUser, setSearchedUser] = useState<AppUser | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [connectModalOpen, setConnectModalOpen] = useState<boolean>(false);
  const toast = useToast();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const userQuery = query(
          collection(firestore, "users"),
          where("email", "==", searchTerm)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setSearchedUser({ ...userDoc.data(), uid: userDoc.id } as AppUser);
        } else {
          console.error("No user found with the provided email.");
          // Displaying a toast when no user found
          toast({
            title: "Error.",
            description: "No user found with the provided email.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        // Displaying a toast when there's an error during search
        toast({
          title: "Error.",
          description: "Error fetching user.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleSendRequest = (user: AppUser) => {
    setConnectModalOpen(true); // This will open the ConnectQuestionModal
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search for User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
              <Input
                type="email"
                placeholder="Enter user's email"
                value={searchTerm}
                onChange={handleChange}
              />
              <InputRightElement>
                <Button h="1.75rem" size="sm" onClick={handleSearch}>
                  <SearchIcon /> {/* <-- Use the Search icon instead of text */}
                </Button>
              </InputRightElement>
            </InputGroup>
            {searchedUser && (
              <HStack mt={5} w="100%">
                <Avatar
                  src={searchedUser.photoURL ? searchedUser.photoURL : ""}
                  size="md"
                  mr={3}
                />
                <Box flex="1">
                  <Text fontWeight="bold">{searchedUser.displayName}</Text>
                  <Text color="gray.500">{searchedUser.email}</Text>
                </Box>
                <Button
                  onClick={() =>
                    searchedUser && handleSendRequest(searchedUser)
                  }
                  colorScheme="blue"
                >
                  Connect
                </Button>
              </HStack>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <ConnectQuestionModal
        isOpen={connectModalOpen}
        onClose={() => {
          setConnectModalOpen(false);
          setSearchedUser(null); // Clear the selected user when modal is closed
        }}
        selectedUser={searchedUser}
        type="sender"
      />
    </>
  );
};

export default SelectFromCommunityModal;
