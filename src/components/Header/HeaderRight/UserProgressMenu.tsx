import {
  useBreakpointValue,
  Flex,
  IconButton,
  Button,
  Box,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuSmilePlus } from "react-icons/lu";
import { BsCalendarWeek } from "react-icons/bs";
import { MdOutlineForum } from "react-icons/md";
import { User } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { BuddyRequest, buddyRequestState } from "@/atoms/buddyAtom";
import { useRecoilState } from "recoil";

type UserProgressMenuProps = {
  user?: User | null;
};

type ReflectConnectProps = {
  pendingRequests: number;
  children?: React.ReactNode;
  [key: string]: any;
};

// ReflectConnectIconButton component:

const ReflectConnectIconButton: React.FC<ReflectConnectProps> = ({
  pendingRequests,
  ...props
}) => (
  <Box position="relative">
    <IconButton aria-label={""} {...props}></IconButton>
    {pendingRequests > 0 && (
      <Box
        position="absolute"
        right="0"
        top="0"
        bg="red.500"
        borderRadius="full"
        w={3}
        h={3}
      />
    )}
  </Box>
);

// ReflectConnectButton component:

const ReflectConnectButton: React.FC<ReflectConnectProps> = ({
  pendingRequests,
  children,
  ...props
}) => (
  <Button {...props}>
    {children}
    {pendingRequests > 0 && (
      <Badge
        ml="1"
        colorScheme="blue"
        variant="solid"
        fontSize="lg"
        borderRadius="full"
      >
        {pendingRequests}
      </Badge>
    )}
  </Button>
);

const UserProgressMenu: React.FC<UserProgressMenuProps> = ({ user }) => {
  const router = useRouter();
  const [buddyRequests, setBuddyRequests] = useRecoilState(buddyRequestState);
  const [pendingRequests, setPendingRequests] = useState(0);

  const showWeeklyReview = () => {
    router.push("/review");
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, "buddyRequests"),
      where("toUserId", "==", user.uid),
      where("status", "==", "pending")
    );

    // Setting up real-time listener using onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests: BuddyRequest[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BuddyRequest[];

      setBuddyRequests(requests);
      setPendingRequests(requests.length);
    });

    // Cleanup: Unsubscribe from the listener when component is unmounted
    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <>
      <Flex gap={1.5}>
        {isMobile ? (
          <IconButton
            aria-label="Share"
            icon={<LuSmilePlus />}
            onClick={() => {
              router.push("/");
            }}
            borderRadius="full"
            size="md"
            bg={router.pathname === "/" ? "#ff5e0e" : undefined}
          />
        ) : (
          <Button
            leftIcon={<LuSmilePlus />}
            onClick={() => {
              router.push("/");
            }}
            bg={router.pathname === "/" ? "#ff5e0e" : undefined}
          >
            Me
          </Button>
        )}

        {isMobile ? (
          <IconButton
            aria-label="My Week"
            icon={<BsCalendarWeek />}
            onClick={() => router.push("/tracker")}
            borderRadius="full"
            size="md"
            bg={router.pathname === "/tracker" ? "#ff5e0e" : undefined}
          />
        ) : (
          <Button
            leftIcon={<BsCalendarWeek />}
            onClick={() => router.push("/tracker")}
            bg={router.pathname === "/tracker" ? "#ff5e0e" : undefined}
          >
            Tracker
          </Button>
        )}

        {isMobile ? (
          <ReflectConnectIconButton
            aria-label="Reflect & Connect"
            icon={<MdOutlineForum />}
            pendingRequests={pendingRequests}
            onClick={showWeeklyReview}
            borderRadius="full"
            size="md"
            bg={router.pathname === "/review" ? "#ff5e0e" : undefined}
          />
        ) : (
          <ReflectConnectButton
            leftIcon={<MdOutlineForum />}
            pendingRequests={pendingRequests}
            onClick={showWeeklyReview}
            bg={router.pathname === "/review" ? "#ff5e0e" : undefined}
          >
            Reflect & Connect
          </ReflectConnectButton>
        )}
      </Flex>
    </>
  );
};

export default UserProgressMenu;
