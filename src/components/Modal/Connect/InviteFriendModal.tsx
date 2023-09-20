import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { User } from "firebase/auth";

interface InviteFriendModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const InviteFriendModal: React.FC<InviteFriendModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const inviteText = `
👋 Hey,

I'm using KaiKul 🚀 for goal tracking and collaboration. It's incredibly helpful and I think you'd like it too! 💪

Join me at www.kaikul.com.

Cheers! 🎉
${user?.displayName ? user.displayName : user?.email}
`;

  const handleInvite = () => {
    navigator.clipboard.writeText(inviteText);

    // Display a success toast
    toast({
      title: "Copy Successful",
      description:
        "Your message has been successfully copied to the clipboard.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite a Friend</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="md">
            {inviteText.split("\n").map((item, key) => {
              return (
                <span key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleInvite}>Copy to Clipboard</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InviteFriendModal;
