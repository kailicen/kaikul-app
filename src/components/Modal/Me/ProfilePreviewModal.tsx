// ProfilePreviewModal.tsx
import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import { User } from "firebase/auth";

type Props = {
  user: User;
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ProfilePreviewModal: React.FC<Props> = ({
  user,
  profile,
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profile Preview Before Sharing</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb={1}>
            🌟 Meet{" "}
            {user.displayName ? user.displayName : user.email?.split("@")[0]} 🌟
          </Text>

          {profile.selfIntroduction && (
            <>
              <Text fontWeight="bold" mt={2}>
                Introduction:
              </Text>
              <Text>{profile.selfIntroduction}</Text>
            </>
          )}

          {profile.domains && profile.domains.length && (
            <>
              <Text fontWeight="bold" mt={2}>
                Domains that Inspire Me:
              </Text>
              <Text>{(profile.domains as string[]).join(", ")}</Text>
            </>
          )}

          {profile.biggestGoal && (
            <>
              <Text fontWeight="bold" mt={2}>
                My Ultimate Goal:
              </Text>
              <Text>{profile.biggestGoal}</Text>
            </>
          )}

          {profile.challenges && (
            <>
              <Text fontWeight="bold" mt={2}>
                Challenges I&apos;m Overcoming:
              </Text>
              <Text>{profile.challenges}</Text>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onConfirm}>
            Share Now
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfilePreviewModal;
