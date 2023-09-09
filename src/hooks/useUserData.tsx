import { firestore } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useUserData = (user: User) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData?.displayName || "");
          setImagePreview(userData?.photoURL || "");
        } else {
          setUsername(user.displayName || "");
          setImagePreview(user.photoURL || "");
        }
      };
      fetchUserData();
    }
  }, [user]);

  return {
    username,
    imagePreview,
  };
};
