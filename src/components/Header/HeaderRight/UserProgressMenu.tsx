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
import { AiOutlineShareAlt } from "react-icons/ai";
import { BsCalendarWeek } from "react-icons/bs";
import { MdOutlineForum } from "react-icons/md";
import { User } from "firebase/auth";
import ShareProgressModal from "@/components/Modal/ShareProgress/ShareProgressModal";
import { BuddyRequest } from "@/components/Modal/Connect/SelectFromCommunityModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const showStats = () => {
    router.push("/stats");
  };

  const showWeeklyReview = () => {
    router.push("/review");
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (user) {
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
          toUserId: doc.data().toUserId,
          status: doc.data().status,
          timestamp: doc.data().timestamp,
        })) as BuddyRequest[];

        setPendingRequests(requests.length);
      };

      fetchData();
      fetchData();
    }
  }, [user]);

  return (
    <>
      <Flex gap={1.5}>
        {isMobile ? (
          <IconButton
            aria-label="My Week"
            icon={<BsCalendarWeek />}
            onClick={() => router.push("/")}
            borderRadius="full"
            size="md"
            color="white"
          />
        ) : (
          <Button
            leftIcon={<BsCalendarWeek />}
            onClick={() => router.push("/")}
          >
            Tracker
          </Button>
        )}

        {isMobile ? (
          <IconButton
            aria-label="Share"
            icon={<AiOutlineShareAlt />}
            onClick={openShareModal}
            borderRadius="full"
            size="md"
            color="white"
          />
        ) : (
          <Button leftIcon={<AiOutlineShareAlt />} onClick={openShareModal}>
            Share
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

      {/* Share Progress Modal */}
      <ShareProgressModal isOpen={isShareModalOpen} onClose={closeShareModal} />
    </>
  );
};

export default UserProgressMenu;
