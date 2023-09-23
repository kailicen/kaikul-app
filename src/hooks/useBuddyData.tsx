import { Buddy } from "@/atoms/buddyAtom";
import { UserProfile } from "@/atoms/userProfileAtom";
import { auth, firestore } from "@/firebase/clientApp";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function shuffleArray(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const useBuddyData = () => {
  const [user] = useAuthState(auth);
  const [buddyProfiles, setBuddyProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchBuddyProfiles = async () => {
        try {
          const q = query(
            collection(firestore, "userProfiles"),
            where("buddyOrSolo", "==", "buddy")
          );
          const querySnapshot = await getDocs(q);
          let buddyUsers = await Promise.all(
            querySnapshot.docs.map(async (docSnapshot) => {
              const userProfile = docSnapshot.data() as UserProfile;
              const userDoc = doc(firestore, "users", docSnapshot.id);
              const userSnapshot = await getDoc(userDoc);
              const userData = userSnapshot.data();

              return {
                ...userProfile,
                ...userData,
                id: docSnapshot.id,
              };
            })
          );

          // Exclude the current user from the list
          buddyUsers = buddyUsers.filter(
            (buddyUser) => buddyUser.userId !== user.uid
          );

          // Shuffle the remaining users randomly
          shuffleArray(buddyUsers);

          // Select the top 3 users from the shuffled array
          const top3Users = buddyUsers.slice(0, 2);

          setBuddyProfiles(top3Users);
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBuddyProfiles();
    }
  }, [user]);

  // Functions to fetch different data types
  const fetchBuddyProfileById = async (
    id: string
  ): Promise<UserProfile | null> => {
    try {
      const userProfileDoc = doc(firestore, "userProfiles", id);
      const userProfileSnapshot = await getDoc(userProfileDoc);
      const userProfileData = userProfileSnapshot.data() as UserProfile;
      return userProfileData;
    } catch (error) {
      console.error("Error fetching user profile by ID:", error);
      return null;
    }
  };

  const fetchBuddyById = async (id: string): Promise<Buddy | null> => {
    try {
      const buddyDoc = doc(firestore, "users", id);
      const buddySnapshot = await getDoc(buddyDoc);
      const buddyData = buddySnapshot.data() as Buddy;
      return {
        ...buddyData,
        id: id,
      };
    } catch (error) {
      console.error("Error fetching buddy by ID:", error);
      return null;
    }
  };

  return { buddyProfiles, loading, fetchBuddyById, fetchBuddyProfileById };
};
