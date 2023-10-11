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
  useColorMode,
} from "@chakra-ui/react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { EditIcon } from "@chakra-ui/icons";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import { useUserData } from "@/hooks/useUserData";
import FloatingFeedbackButton from "@/components/App/FloatingFeedbackButton";

interface ProfileFormValues {
  username: string;
  profilePicture: File | null;
}

function ProfilePage() {
  const [user] = useAuthState(auth);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [userEmail, setUserEmail] = useState("");
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

  useEffect(() => {
    // Load the user's email from localStorage when the component mounts
    const storedUserEmail = localStorage.getItem("userEmail");
    
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    } else if (user?.email) { // Use optional chaining to check for user.email
      setUserEmail(user.email);
      localStorage.setItem("userEmail", user.email); // Store in localStorage
    }
  }, [user?.email]); // Add user?.email as a dependency with optional chaining

  return (
    <>
      <AuthenticatedHeader user={user} />
      <div style={{ marginLeft: "80px", marginRight: "80px" }} className="container">
        <Flex
          maxWidth="768px" 
          direction="row" 
          align="center"
          justify="start" 
          mt="120px"
          mb="96px"
          px="16"
          py="32px"
          border="1px"
          borderRadius="md"
          boxShadow="lg"
          borderColor={colorMode === "light" ? "gray.200" : "gray.500"}
        >
          <Box position="relative">
            <Avatar
              src={imagePreview} // Add a default avatar picture url here
              // size="xl"
              style={{ width: '150px', height: '150px' }} // Adjust the size as needed
              objectFit="cover"
              borderRadius="full"
            />
            <label htmlFor="upload-profile-pic">
              <IconButton
                aria-label="Upload new picture"
                icon={<EditIcon />}
                size="lg"
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
          <Box pl="32px" position="relative" justifyContent="space-between" alignItems="center" >
            <Text style={{ fontSize: '48px', fontWeight: 'bold' }}>{username}</Text>
            <Text style={{ marginBottom: "8px" }} color={ colorMode === "light" ? "gray.700" : "gray.500" }>
              {userEmail}
            </Text>
            <Text color={ colorMode === "light" ? "gray.700" : "gray.500" }>
              🟢 Online
            </Text>
          </Box>
          {/* <VStack spacing={4} align="center" pt="10">
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
          </VStack> */}
        </Flex>
        <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "24px" }}>Profile</h1>
        <Flex
          direction="column" 
          align="start" 
          justify="start" 
          bg={colorMode === "light" ? "gray.50" : "gray.700"}
          mb="80px"
          px="16"
          py="32px"
          border="1px"
          borderRadius="md"
          boxShadow="lg"
          borderColor={colorMode === "light" ? "gray.200" : "gray.500"}
        >
          <Flex
            width="100%"
            direction="row"
            align="center"
            justifyContent="space-between"
            justify="between"
            marginBottom="16px"
            borderBottom="1px solid"
            borderColor={colorMode === "light" ? "gray.200" : "gray.500"}
          >
            {/* ROW */}
            <Flex
              direction="column"
              align="start" 
              justify="start" 
            >
              <Flex
                direction="row"
                align="center"
                justify="start" 
              >
                <img src="" alt="" />
                <Text>
                  Two-Word Bio
                </Text>
              </Flex>
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>Driven Innovator</Text>
            </Flex>
            <Button borderRadius="8px">Edit</Button>
          </Flex>
          <Flex
            width="100%"
            direction="row"
            align="center"
            justifyContent="space-between"
            justify="between"
            marginBottom="16px"
            borderBottom="1px solid"
            borderColor={colorMode === "light" ? "gray.200" : "gray.500"}
          >
            {/* ROW */}
            <Flex
              direction="column"
              align="start" 
              justify="start"
            >
              <Flex
                direction="row"
                align="center"
                justify="start" 
              >
                <img src="" alt="" />
                <Text>
                  Profession
                </Text>
              </Flex>
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>Frontend Engineer</Text>
            </Flex>
            <Button borderRadius="8px">Edit</Button>
          </Flex>
          <Flex
            width="100%"
            direction="row"
            align="center"
            justifyContent="space-between"
            justify="between"
            marginBottom="16px"
            borderBottom="1px solid"
            borderColor={colorMode === "light" ? "gray.200" : "gray.500"}
          >
            {/* ROW */}
            <Flex
              direction="column"
              align="start" 
              justify="start" 
            >
              <Flex
                direction="row"
                align="center"
                justify="start" 
              >
                <img src="" alt="" />
                <Text>
                  Date of Joining
                </Text>
              </Flex>
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>31-May-2023</Text>
            </Flex>
            <Button borderRadius="8px">Edit</Button>
          </Flex>
          <Flex
            width="100%"
            direction="row"
            align="center"
            justifyContent="space-between"
            justify="between"
            marginBottom="16px"
            borderBottom="1px solid"
            borderColor={colorMode === "light" ? "gray.200" : "gray.500"}
          >
            {/* ROW */}
            <Flex
              direction="column"
              align="start" 
              justify="start" 
            >
              <Flex
                direction="row"
                align="center"
                justify="start" 
              >
                <img src="" alt="" />
                <Text>
                  Self-Quote
                </Text>
              </Flex>
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>Do the impossible and you'll never doubt yourself ever again.</Text>
            </Flex>
            <Button borderRadius="8px">Edit</Button>
          </Flex>
        </Flex>
        <FloatingFeedbackButton /> {/* Add the feedback button */}
      </div>
    </>
  );
}

export default ProfilePage;
