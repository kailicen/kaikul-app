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
import { AppUser, BuddyRequest, buddyListState } from "@/atoms/buddyAtom";
import {
  collection,
  serverTimestamp,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { useRecoilState } from "recoil";

type ModalType = "sender" | "receiver";

type ConnectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConnectClose?: () => void;
  selectedUser: AppUser | null;
  type: ModalType;
  requestId?: string | null; // Optional request ID for receivers
};

export const ConnectQuestionModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  onConnectClose,
  selectedUser,
  type,
  requestId,
}) => {
  const [user] = useAuthState(auth);
  const [buddies, setBuddies] = useRecoilState(buddyListState);

  const [message, setMessage] = useState(""); // rename from senderReason to make it more generic

  const toast = useToast();

  const handleSubmit = async (selectedUser: AppUser | null) => {
    // Check if message is empty
    if (!message.trim()) {
      toast({
        title: "Field Required",
        description: "Please provide an answer in the field.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return; // Exit out of the function
    }

    if (type === "sender") {
      // Existing logic for the sender...
      if (user && selectedUser) {
        // check if user is not sending a request to themselves
        if (user.uid !== selectedUser.uid) {
          // Check if there's an existing pending request to the same user
          // Check if there's an existing pending request to the same user
          const q = query(
            collection(firestore, "buddyRequests"),
            where("fromUserId", "==", user.uid),
            where("toUserId", "==", selectedUser.uid),
            where("status", "==", "pending")
          );

          const existingRequestSnapshot = await getDocs(q);

          if (!existingRequestSnapshot.empty) {
            toast({
              title: "Request already sent",
              description:
                "You have already sent a buddy request to this user.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          const buddyRequest: BuddyRequest = {
            id: "", // Firebase Firestore will auto-generate this when you add the document
            fromUserId: user.uid,
            fromUserDisplayName: user.displayName || "",
            fromUserEmail: user.email || "",
            fromUserPhotoURL: user.photoURL || "",
            toUserId: selectedUser.uid,
            status: "pending",
            timestamp: serverTimestamp(),
            senderReason: message,
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
    } else if (type === "receiver" && requestId && selectedUser) {
      const requestRef = doc(firestore, "buddyRequests", requestId);
      await updateDoc(requestRef, {
        recipientResponse: message,
        status: "accepted",
      });

      // After accepting the request and updating the Firestore:
      setBuddies((prevBuddies) => [
        ...prevBuddies,
        {
          id: selectedUser.uid,
          displayName: selectedUser.displayName,
          email: selectedUser.email,
          photoURL: selectedUser.photoURL,
        },
      ]);

      onClose();
      if (onConnectClose) {
        onConnectClose(); // This closes the BuddyRequestsModal
      }

      toast({
        title: "Buddy request accepted",
        description: `You have accepted a buddy request from ${
          selectedUser?.displayName || selectedUser?.email
        }.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Connect with {selectedUser?.displayName || selectedUser?.email}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="reason">
            <FormLabel>
              {type === "sender"
                ? `Share something you're currently working on or trying to learn. How do you feel ${
                    selectedUser?.displayName || selectedUser?.email
                  } might offer insights or support in this?`
                : `Talk about a personal goal or interest that excites you. How might a chat with ${
                    selectedUser?.displayName || selectedUser?.email
                  } add value or perspective to it?`}
            </FormLabel>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your answer..."
              required
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => handleSubmit(selectedUser)}
          >
            {type === "sender" ? "Send" : "Accept"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
