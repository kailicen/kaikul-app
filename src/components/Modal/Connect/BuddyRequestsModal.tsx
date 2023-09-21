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
import { buddyRequestState } from "@/atoms/buddyRequestsAtom";
import { useRecoilState } from "recoil";
import { FaCheck, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { useState } from "react";

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
                        <Text
                          fontSize="sm"
                          mt={2}
                          isTruncated={request.id !== expandedRequestId}
                          maxWidth="200px"
                          title={request.reason}
                        >
                          Reason: {request.reason}
                        </Text>
                        <Text
                          fontSize="sm"
                          mt={2}
                          isTruncated={request.id !== expandedRequestId}
                          maxWidth="200px"
                          title={request.gain}
                        >
                          Gain: {request.gain}
                        </Text>
                        <Text
                          fontSize="sm"
                          mt={2}
                          isTruncated={request.id !== expandedRequestId}
                          maxWidth="200px"
                          title={request.offer}
                        >
                          Offer: {request.offer}
                        </Text>
                      </Box>
                      <Spacer />
                      <Box display="flex" flexDirection="row" gap={3}>
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
                        <FaCheck
                          color="green"
                          cursor="pointer"
                          onClick={() =>
                            updateRequestStatus(
                              request.id as string,
                              "accepted"
                            )
                          }
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
