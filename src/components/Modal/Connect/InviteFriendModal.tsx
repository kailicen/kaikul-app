import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

interface InviteFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteFriendModal: React.FC<InviteFriendModalProps> = ({
  isOpen,
  onClose,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Invite a Friend</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {/* Your form for inviting friends goes here */}
        Invite your friend to join Kaikul.
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
          Close
        </Button>
        <Button colorScheme="green">Invite</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default InviteFriendModal;
