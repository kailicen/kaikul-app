import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, storage, auth } from "../firebase/clientApp";
import { User, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import {
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  IconButton,
  useToast,
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { EditIcon } from "@chakra-ui/icons";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import { useUserData } from "@/hooks/useUserData";

interface ProfileFormValues {
  username: string;
  profilePicture: File | null;
}

function ProfilePage() {
  const [user] = useAuthState(auth);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { username, imagePreview, setUsername, setImagePreview } = useUserData(
    user as User
  );

  // Handle profile picture selection
  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setProfilePicture(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async () => {
    setIsSubmitting(true);
    if (!user) {
      return; // User is not authenticated, handle appropriately
    }

    try {
      // Update the user's display name in Firebase Authentication
      await updateProfile(auth.currentUser!, {
        displayName: username,
      });

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (profilePicture) {
        const reader = new FileReader();
        const readAsDataURL = new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target!.result as string);
          reader.onerror = (e) => reject(e.target!.error);
          reader.readAsDataURL(profilePicture);
        });

        const dataUrl = await readAsDataURL;
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadString(imageRef, dataUrl, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        if (userDoc.exists()) {
          // Update document in Firestore for non-Google users
          await updateDoc(userDocRef, {
            displayName: username,
            photoURL: downloadURL,
          });
        } else {
          // Create document in Firestore for Google users
          await setDoc(userDocRef, {
            displayName: username,
            photoURL: downloadURL,
            email: user.email || "",
          });
        }
      } else {
        if (userDoc.exists()) {
          // Update username only in Firestore for non-Google users
          await updateDoc(userDocRef, {
            displayName: username,
          });
        } else {
          // Create username only document in Firestore for Google users
          await setDoc(userDocRef, {
            displayName: username,
            email: user.email || "",
            photoURL: user.photoURL || "",
          });
        }
      }
      toast({
        title: "Profile updated.",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Error updating profile:", error);

      toast({
        title: "Error.",
        description: "There was an error updating your profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <AuthenticatedHeader user={user} />
      <Flex direction="column" align="center" justify="center" m={5} pt="100px">
        <Box position="relative">
          <Avatar
            src={imagePreview} // Add a default avatar picture url here
            size="xl"
            objectFit="cover"
            borderRadius="full"
          />
          <label htmlFor="upload-profile-pic">
            <IconButton
              aria-label="Upload new picture"
              icon={<EditIcon />}
              size="sm"
              position="absolute"
              bottom="0"
              right="0"
              onClick={() => {
                const fileInput = document.getElementById(
                  "upload-profile-pic"
                ) as HTMLInputElement;
                fileInput.click();
              }}
            />
            <Input
              type="file"
              id="upload-profile-pic"
              style={{ display: "none" }}
              onChange={handleProfilePictureChange}
            />
          </label>
        </Box>
        <VStack spacing={4} align="center" pt="10">
          <FormControl>
            <FormLabel>Username:</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <Button
            type="button"
            colorScheme="blue"
            isLoading={isSubmitting}
            onClick={handleProfileSubmit}
          >
            {isSubmitting ? <Spinner /> : "Update Profile"}
          </Button>
        </VStack>
      </Flex>
    </>
  );
}

export default ProfilePage;
