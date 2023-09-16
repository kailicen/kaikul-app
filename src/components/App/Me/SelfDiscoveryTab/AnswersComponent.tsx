import { useState } from "react";
import {
  VStack,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Text,
  Box,
  Textarea,
  DrawerCloseButton,
  Avatar,
} from "@chakra-ui/react";
import { WeeklyAnswer } from "@/atoms/weeklyAnswersAtom";
import { useWeeklyAnswers } from "@/hooks/useWeeklyAnswers";
import { User } from "firebase/auth";
import { useColorMode } from "@chakra-ui/react";
import useUserPoints from "@/hooks/useUserPoints";

type Props = {
  user: User | null | undefined;
  theme: string;
  question: string;
};

const AnswersComponent = ({ user, theme, question }: Props) => {
  const { answers, addAnswerToFirebase } = useWeeklyAnswers(user, theme);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const [editingAnswer, setEditingAnswer] = useState<WeeklyAnswer | null>(null);
  const { colorMode } = useColorMode();
  const { updatePoints } = useUserPoints(user as User);

  const handleEditAnswer = async () => {
    if (editingAnswer) {
      await addAnswerToFirebase(newAnswer, editingAnswer);
      setNewAnswer("");
      setDrawerOpen(false);
      setEditingAnswer(null);
    }
  };

  const handleAddAnswer = async () => {
    await addAnswerToFirebase(newAnswer);
    setNewAnswer("");
    setDrawerOpen(false);
    if (user) {
      await updatePoints(2); // Adds 2 points to the user's total points
    }
  };

  const userAnswer = answers.find((answer) => user?.uid === answer.userId);
  const otherAnswers = answers.filter((answer) => user?.uid !== answer.userId);

  return (
    <VStack
      align="start"
      spacing={4}
      maxH="500px"
      overflowY="auto"
      width="100%"
      w="100%"
      bg={colorMode === "light" ? "white" : "gray.800"}
    >
      {!userAnswer && (
        <Button className="mt-4 mb-2 py-4" onClick={() => setDrawerOpen(true)}>
          Add Your Answer
        </Button>
      )}

      {userAnswer && (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          display="flex"
          alignItems="flex-start"
          bg={colorMode === "light" ? "#e4dff3" : "gray.700"}
          w="100%"
        >
          <Avatar
            src={userAnswer.photoURL || undefined}
            name={userAnswer.displayName || "Anonymous User"}
            size="sm"
            mr={4}
          />
          <Box>
            <Text fontSize="sm" color="gray.500">
              {userAnswer.displayName || "Anonymous User"}
            </Text>
            <Text>{userAnswer.answer}</Text>
          </Box>
          <Button
            size="sm"
            ml="2"
            onClick={() => {
              setEditingAnswer(userAnswer);
              setNewAnswer(userAnswer.answer);
              setDrawerOpen(true);
            }}
          >
            Edit
          </Button>
        </Box>
      )}

      {otherAnswers.map((answer: WeeklyAnswer, index: number) => (
        <Box
          key={index}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          display="flex"
          alignItems="flex-start"
          bg={colorMode === "light" ? "#e4dff3" : "gray.700"}
          w="100%"
        >
          <Avatar
            src={answer.photoURL || undefined}
            name={answer.displayName || "Anonymous User"}
            size="sm"
            mr={4}
          />
          <Box>
            <Text fontSize="sm" color="gray.500">
              {answer.displayName || "Anonymous User"}
            </Text>
            <Text>{answer.answer}</Text>
          </Box>
        </Box>
      ))}
      <Drawer
        isOpen={isDrawerOpen}
        size="md"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {editingAnswer ? "Edit Your Answer" : "Add Your Answer"}
            </DrawerHeader>
            <DrawerBody>
              <Box mb={5}>{question}</Box>
              <Textarea
                placeholder="Type your answer here..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={7}
              />
              <Button
                mt={4}
                colorScheme="blue"
                onClick={editingAnswer ? handleEditAnswer : handleAddAnswer}
              >
                Submit
              </Button>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </VStack>
  );
};

export default AnswersComponent;
