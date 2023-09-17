import { useMemo, useState } from "react";
import {
  VStack,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Box,
  Textarea,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { WeeklyAnswer } from "@/atoms/weeklyAnswersAtom";
import { useWeeklyAnswers } from "@/hooks/useWeeklyAnswers";
import { User } from "firebase/auth";
import { useColorMode } from "@chakra-ui/react";
import useUserPoints from "@/hooks/useUserPoints";
import { AnswerBox } from "./AnswerBox";

type Props = {
  user: User | null | undefined;
  theme: string;
  question: string;
};

const AnswersComponent = ({ user, theme, question }: Props) => {
  const { answers, addAnswerToFirebase, addReactionToFirebase } =
    useWeeklyAnswers(user, theme);
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

  const handleAddReaction = async (answer: WeeklyAnswer, emoji: string) => {
    if (user) {
      await addReactionToFirebase(answer.id, user.uid, emoji); // assuming answer has an id property
    }
  };

  const userAnswer = useMemo(
    () => answers.find((answer) => user?.uid === answer.userId),
    [answers, user]
  );
  const otherAnswers = useMemo(
    () => answers.filter((answer) => user?.uid !== answer.userId),
    [answers, user]
  );

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
        <AnswerBox
          answer={userAnswer}
          isUserAnswer={true}
          onEdit={() => {
            setEditingAnswer(userAnswer);
            setNewAnswer(userAnswer.answer);
            setDrawerOpen(true);
          }}
          onAddReaction={(emoji) => handleAddReaction(userAnswer, emoji)}
        />
      )}

      {otherAnswers.map((answer) => (
        <AnswerBox
          key={answer.id}
          answer={answer}
          isUserAnswer={false}
          onAddReaction={(emoji) => handleAddReaction(answer, emoji)}
        />
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
