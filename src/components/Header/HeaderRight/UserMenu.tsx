import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Image,
} from "@chakra-ui/react";
import { User, signOut } from "firebase/auth";
import { VscAccount } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { auth } from "../../../firebase/clientApp";
import { useRouter } from "next/router";

type UserMenuProps = { user?: User | null };

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();

  const logout = async () => {
    router.push("/");
    await signOut(auth);
  };

  return (
    <Menu>
      <MenuButton cursor="pointer" padding="0px 6px" borderRadius={4}>
        <Flex align="center">
          {user?.photoURL ? (
            <Image
              boxSize="36px"
              borderRadius="full"
              src={user.photoURL}
              alt={user.displayName || "User"}
              mr={1}
            />
          ) : (
            <Icon
              fontSize={36}
              color="purple.400"
              _hover={{ color: "purple.600" }}
              mr={1}
              as={VscAccount}
            />
          )}
        </Flex>
      </MenuButton>
      <MenuList>
        {/* <MenuItem
          fontSize="10pt"
          fontWeight={700}
          _hover={{ bg: "purple.400", color: "white" }}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={CgProfile} />
            Profile
          </Flex>
        </MenuItem>
        <MenuDivider /> */}
        <MenuItem
          fontSize="10pt"
          fontWeight={700}
          _hover={{ bg: "purple.400", color: "white" }}
          onClick={logout}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
            Log Out
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
