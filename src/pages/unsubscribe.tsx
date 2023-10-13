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
  Spinner,
  Heading,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { FaSadTear } from "react-icons/fa";

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
        title: "An error occurred.",
        description:
          "Unable to unsubscribe. Please contact us and we will help you out;)",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error unsubscribing user: ", error);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      // Check if selectedReason is undefined or null
      if (!selectedReason) {
        toast({
          title: "Error",
          description: "Please select a reason.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return; // exit the function early to prevent further execution
      }

      // Generate a new feedback doc in the feedback collection
      const feedbackRef = collection(firestore, "feedback");
      // Add a new document with auto-generated ID, storing reason, comments, and optional userId
      await addDoc(feedbackRef, {
        reason: selectedReason,
        comments: feedback,
        userId: userId || null, // store userId or null if not available
        timestamp: new Date().getTime(), // store the current timestamp
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
        <VStack spacing={6} align="center" mt={20}>
          <Spinner size="xl" />
          <Heading size="lg">Unsubscribing...</Heading>
        </VStack>
      ) : (
        <VStack spacing={8} align="center" mt={12}>
          <Icon as={FaSadTear} boxSize={16} color="gray.600" />
          <Heading size="lg">We&apos;re sad to see you go!</Heading>
          <Text>
            We appreciate your time with us and would love to hear why
            you&apos;re leaving.
          </Text>

          <VStack align="start" w={["full", null, "2xl"]} spacing={6}>
            <FormControl as="fieldset" id="feedback" mb={4}>
              <FormLabel as="legend" fontWeight="medium" fontSize="lg">
                Reason for unsubscribing
              </FormLabel>
              <RadioGroup onChange={setSelectedReason} value={selectedReason}>
                <Stack spacing={4} direction="column">
                  <Radio value="No longer interested">
                    No longer interested
                  </Radio>
                  <Radio value="Too many emails">Too many emails</Radio>
                  <Radio value="Content not relevant">
                    Content not relevant
                  </Radio>
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
              <FormHelperText>
                We appreciate your honest feedback.
              </FormHelperText>
            </FormControl>
            <HStack spacing={4} w="full" justify="flex-end">
              <Button variant="outline" onClick={() => router.push("/")}>
                Skip
              </Button>
              <Button colorScheme="blue" onClick={handleFeedbackSubmit}>
                Submit Feedback
              </Button>
            </HStack>
          </VStack>
        </VStack>
      )}
    </Box>
  );
};

export default Unsubscribe;
