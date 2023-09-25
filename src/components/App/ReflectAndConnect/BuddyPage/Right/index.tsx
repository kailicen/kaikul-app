import React, { useEffect, useState } from "react";
import { Text, VStack } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { Buddy, buddyRequestState } from "@/atoms/buddyAtom";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import MyBuddyInfo from "./MyBuddyInfo";

type Props = { user: User; setSelectedBuddy: (buddy: Buddy | null) => void };

function RightSection({ user, setSelectedBuddy }: Props) {
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
    <VStack spacing={4} align="stretch">
      <MyBuddyInfo user={user} setSelectedBuddy={setSelectedBuddy} />
    </VStack>
  );
}

export default RightSection;
