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
import { VscGraph } from "react-icons/vsc";
import { LuSmilePlus } from "react-icons/lu";
import { BsCalendarWeek } from "react-icons/bs";
import { MdOutlineForum } from "react-icons/md";
import { User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { BuddyRequest, buddyRequestState } from "@/atoms/buddyRequestsAtom";
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
      <Badge ml="1" colorScheme="red" borderRadius="full">
        {pendingRequests}
      </Badge>
    )}
  </Button>
);

const UserProgressMenu: React.FC<UserProgressMenuProps> = ({ user }) => {
  const router = useRouter();
  const [buddyRequests, setBuddyRequests] = useRecoilState(buddyRequestState);
  const [pendingRequests, setPendingRequests] = useState(0);

  const showStats = () => {
    router.push("/stats");
  };

  const showWeeklyReview = () => {
    router.push("/review");
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (user) {
      // If there are no buddy requests in the Recoil state, fetch from Firestore
      if (!buddyRequests.length) {
        const fetchData = async () => {
          const q = query(
            collection(firestore, "buddyRequests"),
            where("toUserId", "==", user.uid),
            where("status", "==", "pending")
          );
          const querySnapshot = await getDocs(q);
          const requests: BuddyRequest[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            fromUserId: doc.data().fromUserId,
            fromUserDisplayName: doc.data().fromUserDisplayName,
            fromUserEmail: doc.data().fromUserEmail,
            fromUserPhotoURL: doc.data().fromUserPhotoURL,
            toUserId: doc.data().toUserId,
            status: doc.data().status,
            timestamp: doc.data().timestamp,
          })) as BuddyRequest[];

          // set recoil state
          setBuddyRequests(requests);
        };

        fetchData();
      }

      // Update pendingRequests either way
      setPendingRequests(
        buddyRequests.filter((request) => request.status === "pending").length
      );
    }
  }, [user, buddyRequests]);

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
            color="white"
          />
        ) : (
          <Button
            leftIcon={<LuSmilePlus />}
            onClick={() => {
              router.push("/");
            }}
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
            color="white"
          />
        ) : (
          <Button
            leftIcon={<BsCalendarWeek />}
            onClick={() => router.push("/tracker")}
          >
            Tracker
          </Button>
        )}

        {isMobile ? (
          <IconButton
            aria-label="Weekly Statistics"
            icon={<VscGraph />}
            onClick={showStats}
            borderRadius="full"
            size="md"
          />
        ) : (
          <Button leftIcon={<VscGraph />} onClick={showStats}>
            Stats
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
          />
        ) : (
          <ReflectConnectButton
            leftIcon={<MdOutlineForum />}
            pendingRequests={pendingRequests}
            onClick={showWeeklyReview}
          >
            Reflect & Connect
          </ReflectConnectButton>
        )}
      </Flex>
    </>
  );
};

export default UserProgressMenu;
