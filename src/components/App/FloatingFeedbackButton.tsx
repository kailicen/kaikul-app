import React from "react";
import {
  Box,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FaComment } from "react-icons/fa";

function FloatingFeedbackButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFeedbackClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Box position="fixed" bottom="4" right="4">
      <IconButton
        aria-label="Feedback"
        icon={<FaComment />}
        size="lg"
        colorScheme="teal"
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Your Experience</ModalHeader>
          <ModalBody>
            Join us for a quick chat to share your KaiKul experiences directly
            with our co-founders. We&apos;re excited to hear your thoughts and
            ideas on how we can improve. Let&apos;s connect!
            <Flex direction="column" gap={2} my={3}>
              <Button
                variant="ghost"
                onClick={() =>
                  handleFeedbackClick(
                    "https://calendar.app.google/PRrVoW3K29z5j9xGA"
                  )
                }
              >
                Schedule a call with Boom
              </Button>
              {/* <Button
                variant="ghost"
                onClick={() =>
                  handleFeedbackClick(
                    "https://calendar.app.google/..."
                  )
                }
              >
                Schedule a call with Pawel
              </Button> */}
              <Button
                variant="ghost"
                onClick={() =>
                  handleFeedbackClick(
                    "https://calendar.app.google/LzUsyJbkbGQ87JqYA"
                  )
                }
              >
                Schedule a call with Kaili
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default FloatingFeedbackButton;
