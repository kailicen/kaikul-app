import React, { useState } from "react";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import InviteFriendModal from "@/components/Modal/Connect/InviteFriendModal";
import SelectFromCommunityModal from "@/components/Modal/Connect/SelectFromCommunityModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { User } from "firebase/auth";

const AddBuddy = () => {
  const [user] = useAuthState(auth);
  const [isInviteFriendModalOpen, setInviteFriendModalOpen] = useState(false);
  const [isSelectFromCommunityModalOpen, setSelectFromCommunityModalOpen] =
    useState(false);

  const openInviteFriendModal = () => setInviteFriendModalOpen(true);
  const closeInviteFriendModal = () => setInviteFriendModalOpen(false);

  const openSelectFromCommunityModal = () =>
    setSelectFromCommunityModalOpen(true);
  const closeSelectFromCommunityModal = () =>
    setSelectFromCommunityModalOpen(false);

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          rightIcon={<ChevronDownIcon />}
        >
          Add Buddy
        </MenuButton>
        <MenuList>
          <MenuItem onClick={openInviteFriendModal}>Invite a Friend</MenuItem>
          <MenuItem onClick={openSelectFromCommunityModal}>
            Select from Community
          </MenuItem>
        </MenuList>
      </Menu>

      <InviteFriendModal
        user={user as User}
        isOpen={isInviteFriendModalOpen}
        onClose={closeInviteFriendModal}
      />
      <SelectFromCommunityModal
        isOpen={isSelectFromCommunityModalOpen}
        onClose={closeSelectFromCommunityModal}
      />
    </>
  );
};

export default AddBuddy;
