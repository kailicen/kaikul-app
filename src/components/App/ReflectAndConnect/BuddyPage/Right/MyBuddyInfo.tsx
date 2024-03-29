import React, { useEffect, useState } from "react";
import { useDisclosure, Stack, Button, Badge } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { Buddy, buddyRequestState } from "@/atoms/buddyAtom";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import BuddyRequestsModal from "@/components/Modal/Connect/BuddyRequestsModal";
import BuddyList from "./Components/BuddyList";
import AddBuddy from "./Components/AddBuddy";

type Props = { user: User; setSelectedBuddy: (buddy: Buddy | null) => void };

function MyBuddyInfo({ user, setSelectedBuddy }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [buddyIds, setBuddyIds] = useState<string[]>([]);

  // Use Recoil value to get buddyRequests
  const buddyRequests = useRecoilValue(buddyRequestState);

  // Calculate pendingRequests
  const pendingRequests = buddyRequests.filter(
    (request) => request.status === "pending"
  ).length;

  // Fetch buddy IDs when the component mounts
  useEffect(() => {
    const fetchBuddyIds = async () => {
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data);
          setBuddyIds(data.buddies || []); // replace 'buddies' with the actual field name in your Firestore
        }
      }
    };

    fetchBuddyIds();
  }, [user, pendingRequests]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <AddBuddy />
        <Button variant="outline" onClick={onOpen}>
          View Requests
          {pendingRequests > 0 && (
            <Badge
              ml="1"
              fontSize="lg"
              colorScheme="red"
              variant="solid"
              borderRadius="full"
              position="absolute"
              top="-1"
              right="-1"
            >
              {pendingRequests}
            </Badge>
          )}
        </Button>
        <BuddyRequestsModal isOpen={isOpen} onClose={onClose} />
      </Stack>
      <BuddyList buddyIds={buddyIds} setSelectedBuddy={setSelectedBuddy} />
    </>
  );
}

export default MyBuddyInfo;
