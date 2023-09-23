import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { BuddyRequest } from "@/atoms/buddyAtom";

export const useNotifications = (user?: User | null) => {
  const [numOfPendingRequests, setNumOfPendingRequests] = useState(0);
  const [buddyRequests, setBuddyRequests] = useState<BuddyRequest[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchBuddyRequests = () => {
      const q = query(
        collection(firestore, "buddyRequests"),
        where("toUserId", "==", user.uid),
        where("status", "==", "pending")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BuddyRequest[];

        setBuddyRequests(fetchedRequests);
        setNumOfPendingRequests(fetchedRequests.length);
      });

      return () => {
        unsubscribe();
      };
    };

    fetchBuddyRequests();
  }, [user]);

  return { numOfPendingRequests, buddyRequests };
};
