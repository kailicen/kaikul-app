import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  useToast,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  FormHelperText,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";

const Unsubscribe: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const toast = useToast();
  const [feedback, setFeedback] = useState<string>("");
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string | undefined>(
    undefined
  );
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof token === "string") {
      unsubscribeUser(token);
    }
  }, [token]);

  const unsubscribeUser = async (token: string) => {
    try {
      const functionUrl =
        "https://us-central1-kaikul.cloudfunctions.net/unsubscribeUser";

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse the JSON from the response

      toast({
        title: "Success",
        description: data.message, // Display message from the response
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setShowFeedbackForm(true);
      setUserId(data.userId); // Set the userId in state (ensure you have a state variable set up to store this)
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Unable to unsubscribe. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error unsubscribing user: ", error);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      // Check if userId, selectedReason, or feedback are undefined or null
      if (!userId || !selectedReason || !feedback) {
        toast({
          title: "Error",
          description: "Unable to submit feedback due to missing information.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return; // exit the function early to prevent further execution
      }

      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        feedback: {
          reason: selectedReason,
          comments: feedback,
        },
      });

      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Unable to submit feedback. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error submitting feedback: ", error);
    }
  };

  return (
    <Box p={4}>
      {!showFeedbackForm ? (
        <Text mb={4}>Unsubscribing...</Text>
      ) : (
        <VStack spacing={4}>
          <Text mb={4}>
            You have been unsubscribed. We&apos;re sorry to see you go!
          </Text>
          <Text mb={4}>Please share why you decided to unsubscribe:</Text>
          <FormControl as="fieldset" id="feedback" mb={4}>
            <FormLabel as="legend">Reason for unsubscribing</FormLabel>
            <RadioGroup onChange={setSelectedReason} value={selectedReason}>
              <Stack spacing={4} direction="column">
                <Radio value="No longer interested">No longer interested</Radio>
                <Radio value="Too many emails">Too many emails</Radio>
                <Radio value="Content not relevant">Content not relevant</Radio>
                <Radio value="Other">Other</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl id="additional-feedback">
            <FormLabel>Additional feedback (optional)</FormLabel>
            <Textarea
              placeholder="Your feedback helps us improve our service"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <FormHelperText>We appreciate your honest feedback.</FormHelperText>
          </FormControl>
          <Button onClick={handleFeedbackSubmit}>Submit Feedback</Button>
          <Button variant="link" onClick={() => router.push("/")}>
            Skip and Return Home
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Unsubscribe;
