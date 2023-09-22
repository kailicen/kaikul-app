import { UserProfile } from "@/atoms/userProfileAtom";
import { firestore } from "@/firebase/clientApp";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

function shuffleArray(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const useBuddyUserProfiles = (currentUserProfile: UserProfile) => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfiles = async () => {
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
          (user) => user.userId !== currentUserProfile.userId // changed from user.id to user.uid for clarity
        );

        // Shuffle the remaining users randomly
        shuffleArray(buddyUsers);

        // Select the top 3 users from the shuffled array
        const top3Users = buddyUsers.slice(0, 2);

        setUserProfiles(top3Users);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfiles();
  }, [currentUserProfile]);

  return { userProfiles, loading };
};
