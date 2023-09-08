import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { User, signOut } from "firebase/auth";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { auth, firestore } from "../../../firebase/clientApp";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { useResetRecoilState } from "recoil";
import { buddyRequestState } from "@/atoms/buddyRequestsAtom";
import { IoSparkles } from "react-icons/io5";
import useTasks from "@/hooks/useTasks";
import { format, startOfWeek } from "date-fns";
import useUserPoints from "@/hooks/useUserPoints";

type UserMenuProps = { user?: User | null };

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const resetBuddyRequests = useResetRecoilState(buddyRequestState);

  const [imagePreview, setImagePreview] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [startOfWeekDate, setStartOfWeekDate] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );

  const { userPoints } = useUserPoints(user as User);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData?.displayName || "");
          setImagePreview(userData?.photoURL || "");
        } else {
          setUsername(user.displayName || "");
          setImagePreview(user.photoURL || "");
        }
      };
      fetchUserData();
    }
  }, [user]);

  const logout = async () => {
    // Reset the recoil state
    resetBuddyRequests();

    await signOut(auth);
    router.push("/");
  };

  return (
    <Menu>
      <MenuButton cursor="pointer" padding="0px 6px" borderRadius={4}>
        <Flex align="center" gap={2}>
          {imagePreview != "" ? (
            <Avatar size="sm" name={username} src={imagePreview} />
          ) : (
            <Avatar size="sm" bg="gray.500" />
          )}
          <Flex
            direction="column"
            display={{ base: "none", lg: "flex" }}
            fontSize="9pt"
            align="flex-start"
            mr={8}
          >
            <Text fontWeight={700}>
              {user?.displayName || user?.email?.split("@")[0]}
            </Text>
            <Flex>
              <Icon as={IoSparkles} color="#ff5e0e" mr={1} />
              <Text color="gray.500">{userPoints} K-Points</Text>
            </Flex>
          </Flex>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem
          fontSize="10pt"
          fontWeight={700}
          _hover={{ bg: "#4130AC", color: "white" }}
          onClick={() => router.push("/profile")}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={CgProfile} />
            Profile
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem
          fontSize="10pt"
          fontWeight={700}
          _hover={{ bg: "#4130AC", color: "white" }}
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
