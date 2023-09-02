import { useState, useCallback, useEffect } from "react";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import { useRecoilState } from "recoil";
import {
  UserProfileAddition,
  userProfileAdditionState,
} from "@/atoms/userProfileAdditionAtom";

export const useUserProfileAddition = (user: User) => {
  const [profileAddition, setProfileAddition] = useRecoilState(
    userProfileAdditionState
  );
  const [loadingAddition, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        await fetchUserProfileAddition();
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Optionally set some state here to show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  const saveProfileAddition = async (
    updatedProfileAddition: UserProfileAddition
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Define the reference to the user's profile document
    const profileRef = doc(firestore, "userProfileAdditions", user.uid);

    try {
      // Check if the document exists
      const profileSnapshot = await getDoc(profileRef);

      if (profileSnapshot.exists()) {
        // Update the document if it exists
        await setDoc(
          profileRef,
          {
            ...updatedProfileAddition,
            userId: user.uid,
          },
          { merge: true }
        );
      } else {
        // Create a new document if it doesn't exist
        await setDoc(profileRef, {
          ...updatedProfileAddition,
          userId: user.uid,
        });
      }

      return user.uid;
    } catch (error) {
      console.error("Error saving user profile addition:", error);
    }
  };

  const fetchUserProfileAddition = async () => {
    try {
      const profileRef = doc(firestore, "userProfileAdditions", user.uid);
      const profileSnapshot = await getDoc(profileRef);

      if (profileSnapshot.exists()) {
        const userProfileAddition =
          profileSnapshot.data() as UserProfileAddition;
        setProfileAddition(userProfileAddition);
        return userProfileAddition; // added for comparison in saveProfileAddition
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const updateProfileAddition = async (
    updatedProfileAddition: UserProfileAddition
  ) => {
    // Update the profile in the state
    setProfileAddition(updatedProfileAddition);

    // Save the changes to Firebase
    await saveProfileAddition(updatedProfileAddition);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    profileAddition,
    loadingAddition,
    updateProfileAddition,
    saveProfileAddition,
  };
};
