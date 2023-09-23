import {
  Avatar,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";
import { buddyRequestState } from "@/atoms/buddyAtom";
import { useRecoilState } from "recoil";
import { FaCheck, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { ConnectQuestionModal } from "./ConnectQuestionModal";

interface BuddyRequestsProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuddyRequestsModal: React.FC<BuddyRequestsProps> = ({
  isOpen,
  onClose,
}) => {
  const [buddyRequests, setBuddyRequests] = useRecoilState(buddyRequestState);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
    null
  ); // State to track expanded card
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  const toast = useToast();

  const updateRequestStatus = async (
    requestId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    const requestRef = doc(firestore, "buddyRequests", requestId);

    // find the request that is being updated
    const requestBeingUpdated = buddyRequests.find(
      (request) => request.id === requestId
    );

    await updateDoc(requestRef, { status: newStatus });

    // Remove the request that was just updated from the buddyRequests state
    setBuddyRequests(
      buddyRequests.filter((request) => request.id !== requestId)
    );

    // Show different toast based on status
    if (newStatus === "accepted") {
      toast({
        title: "Buddy request accepted",
        description: `You have accepted a buddy request from ${requestBeingUpdated?.fromUserDisplayName}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else if (newStatus === "rejected") {
      toast({
        title: "Buddy request rejected",
        description: `You have rejected a buddy request from ${requestBeingUpdated?.fromUserDisplayName}.`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buddy Requests</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {buddyRequests.length === 0 ? (
              <Box textAlign="center" py={5}>
                <Text>You have no pending requests.</Text>
              </Box>
            ) : (
              <>
                {buddyRequests.map((request, index) => (
                  <Box
                    key={index}
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    w="full"
                  >
                    <HStack spacing="24px">
                      <Avatar size="md" name={request.fromUserDisplayName} />
                      <Box>
                        {/* Use the expanded state to conditionally render full or truncated text */}
                        <Text fontWeight="bold">
                          {request.fromUserDisplayName}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {request.fromUserEmail}
                        </Text>
                      </Box>
                      <Spacer />
                      <Box display="flex" flexDirection="row" gap={3}>
                        <FaCheck
                          color="green"
                          cursor="pointer"
                          onClick={() => {
                            setCurrentRequestId(request.id || null);
                            setNewModalOpen(true);
                          }}
                        />
                        <FaTimes
                          color="red"
                          cursor="pointer"
                          onClick={() =>
                            updateRequestStatus(
                              request.id as string,
                              "rejected"
                            )
                          }
                        />
                      </Box>
                    </HStack>
                    <ConnectQuestionModal
                      isOpen={newModalOpen}
                      onClose={() => setNewModalOpen(false)}
                      onConnectClose={onClose}
                      type="receiver"
                      requestId={currentRequestId}
                      selectedUser={{
                        uid: request.fromUserId,
                        displayName: request.fromUserDisplayName,
                        email: request.fromUserEmail,
                        photoURL: request.fromUserPhotoURL,
                      }}
                    />
                    <HStack spacing="24px" mt={2}>
                      <Text
                        fontSize="sm"
                        isTruncated={request.id !== expandedRequestId}
                        title={request.senderReason}
                      >
                        Message: {request.senderReason}
                      </Text>
                      <Box>
                        {request.id !== expandedRequestId ? (
                          <FaChevronDown
                            cursor="pointer"
                            onClick={() =>
                              setExpandedRequestId(request.id || null)
                            }
                          />
                        ) : (
                          <FaChevronUp
                            cursor="pointer"
                            onClick={() => setExpandedRequestId(null)}
                          />
                        )}
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </>
            )}
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

export default BuddyRequestsModal;
