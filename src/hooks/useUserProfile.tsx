import { useState, useCallback, useEffect } from "react";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import { useRecoilState } from "recoil";
import { UserProfile, userProfileState } from "@/atoms/userProfileAtom";
import { OnboardingState, onboardingState } from "@/atoms/onboardingAtom";

export const useUserProfile = (user: User) => {
  const [profile, setProfile] = useRecoilState(userProfileState);
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        await Promise.all([
          fetchUserProfileFromFirebase(),
          fetchOnboardingStateFromFirebase(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally set some state here to show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  const handleInputChange = useCallback(
    (field: keyof UserProfile, value: any) => {
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const saveProfileToFirebase = async (values: UserProfile) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Define the reference to the user's profile document
    const profileRef = doc(firestore, "userProfiles", user.uid);

    try {
      // Use setDoc with merge: true for upsert behavior
      await setDoc(
        profileRef,
        {
          ...values,
          userId: user.uid,
        },
        { merge: true }
      ); // merge ensures that if the doc already exists, it will be updated; otherwise, a new one will be created
      setProfile((prev) => ({
        ...prev,
        values,
      }));

      return user.uid; // Return the user's UID as the document ID
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  const fetchUserProfileFromFirebase = async () => {
    try {
      const profileRef = doc(firestore, "userProfiles", user.uid);
      const profileSnapshot = await getDoc(profileRef);

      if (profileSnapshot.exists()) {
        const userProfile = profileSnapshot.data() as UserProfile;
        setProfile(userProfile);
        return userProfile; // added for comparison in saveProfileToFirebase
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const updateProfile = async (updatedProfile: UserProfile) => {
    // Update the profile in the state
    setProfile(updatedProfile);

    // Save the changes to Firebase
    await saveProfileToFirebase(updatedProfile);
  };

  const saveOnboardingStateToFirebase = async (state: OnboardingState) => {
    try {
      // Check if data is different before saving
      const currentState = await fetchOnboardingStateFromFirebase();
      if (JSON.stringify(currentState) !== JSON.stringify(state)) {
        const onboardingRef = doc(firestore, "userOnboardingStates", user.uid);
        await setDoc(onboardingRef, state);
      }
    } catch (error) {
      console.error("Error saving onboarding state:", error);
    }
  };

  const fetchOnboardingStateFromFirebase = async () => {
    try {
      const onboardingRef = doc(firestore, "userOnboardingStates", user.uid);
      const onboardingSnapshot = await getDoc(onboardingRef);

      if (onboardingSnapshot.exists()) {
        const state = onboardingSnapshot.data() as OnboardingState;
        setOnboarding(state);
        return state; // added for comparison in saveOnboardingStateToFirebase
      }
    } catch (error) {
      console.error("Error fetching onboarding state:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    profile,
    onboarding,
    loading,
    handleInputChange,
    saveProfileToFirebase,
    updateProfile,
    saveOnboardingStateToFirebase,
  };
};
