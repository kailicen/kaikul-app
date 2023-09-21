import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import { BuddyRequest, buddyRequestState } from "@/atoms/buddyRequestsAtom";
import {
  collection,
  serverTimestamp,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { AppUser } from "./SelectFromCommunityModal";

type ConnectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  displayName: string | undefined;
  selectedUser: AppUser | null;
};

export const ConnectQuestionModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  displayName,
  selectedUser,
}) => {
  const buddyRequests = useRecoilValue(buddyRequestState);
  const [user] = useAuthState(auth);

  const [reason, setReason] = useState("");
  const [gain, setGain] = useState("");
  const [offer, setOffer] = useState("");

  const toast = useToast();

  const handleSubmit = async (selectedUser: AppUser | null) => {
    if (user && selectedUser) {
      // check if user is not sending a request to themselves
      if (user.uid !== selectedUser.uid) {
        const buddyRequest: BuddyRequest = {
          id: "", // Firebase Firestore will auto-generate this when you add the document
          fromUserId: user.uid,
          fromUserDisplayName: user.displayName || "",
          fromUserEmail: user.email || "",
          fromUserPhotoURL: user.photoURL || "",
          toUserId: selectedUser.uid,
          status: "pending",
          timestamp: serverTimestamp(),
          reason,
          gain,
          offer,
        };

        const docRef = await addDoc(
          collection(firestore, "buddyRequests"),
          buddyRequest
        );
        // Get the generated id from the document reference and update the buddyRequest
        await updateDoc(docRef, { id: docRef.id });
        console.log(`New request added with ID: ${docRef.id}`);

        onClose();

        // Show a message to the user that the buddy request has been sent
        toast({
          title: "Buddy request sent!",
          description: `You have successfully sent a buddy request to ${
            selectedUser.displayName ?? selectedUser.email
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect with {displayName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="reason">
            <FormLabel>Why do you want to connect with this person?</FormLabel>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Your answer..."
            />
          </FormControl>
          <FormControl mt={4} id="reciprocity">
            <FormLabel>
              Our philosophy is reciprocity. What are you hoping to learn or
              gain from connecting with this person?
            </FormLabel>
            <Textarea
              value={gain}
              onChange={(e) => setGain(e.target.value)}
              placeholder="Your answer..."
            />
          </FormControl>
          <FormControl mt={4} id="offer">
            <FormLabel>
              What skills, knowledge, or support can you offer this person in
              return?
            </FormLabel>
            <Textarea
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="Your answer..."
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => handleSubmit(selectedUser)}
          >
            Send
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
