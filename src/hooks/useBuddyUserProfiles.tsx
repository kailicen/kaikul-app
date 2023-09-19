import { UserProfile } from "@/atoms/userProfileAtom";
import { firestore } from "@/firebase/clientApp";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

export const useBuddyUserProfiles = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const q = query(
          collection(firestore, "userProfiles"),
          where("buddyOrSolo", "==", "buddy"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const buddyUsers = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const userProfile = docSnapshot.data() as UserProfile;
            const userDoc = doc(firestore, "users", docSnapshot.id);
            const userSnapshot = await getDoc(userDoc);
            const userData = userSnapshot.data();

            return {
              ...userProfile,
              ...userData,
              id: docSnapshot.id, // Including the ID can be useful
            };
          })
        );
        setUserProfiles(buddyUsers);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfiles();
  }, []);

  return { userProfiles, loading };
};
