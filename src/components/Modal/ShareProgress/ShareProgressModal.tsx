import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  UnorderedList,
  ListItem,
  ModalFooter,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useProgress, { ProgressOption } from "@/hooks/useProgress";
import { format } from "date-fns";

type ShareProgressModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ShareProgressModal: React.FC<ShareProgressModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedProgress, setSelectedProgress] =
    useState<ProgressOption>("Daily Progress");

  // Add new state variable
  const [lastOpened, setLastOpened] = useState<Date>(new Date());
  useEffect(() => {
    if (isOpen) {
      setLastOpened(new Date());
    }
  }, [isOpen]);

  const handleSelectProgress = (progress: ProgressOption) => {
    setSelectedProgress(progress);
  };

  const progressOptions: ProgressOption[] = [
    "Daily Progress",
    "Weekly Progress",
  ];

  const dayOfWeek = format(new Date(), "EEEE");

  const {
    user,
    yesterdayTasks,
    todayTasks,
    blockers,
    weeklyGoals,
    weeklyBlockers,
    totalTasks,
    completedTasks,
  } = useProgress(selectedProgress, lastOpened);

  const toast = useToast();

  const handleShare = async () => {
    // Implement share function
    // Share the selectedProgress to Slack

    const userName = user?.displayName; // replace with the actual user's name
    let text = `*Posted by ${userName}*\n`;

    if (selectedProgress === "Daily Progress") {
      text += `*${dayOfWeek}'s Sprint:*\n`;

      if (yesterdayTasks.length > 0) {
        text += `*✔️ Done:*\n${yesterdayTasks
          .map(
            (task) =>
              `- ${task.text} (${
                task.completed ? "✅ Completed" : "❌ Incomplete"
              })`
          )
          .join("\n")}\n\n`;
      }

      if (todayTasks.length > 0) {
        text += `*📝 To do:*\n${todayTasks
          .map((task) => `- ${task.text}`)
          .join("\n")}\n\n`;
      }

      if (blockers.length > 0) {
        text += `*🚧 Blockers:*\n${blockers
          .map((blocker) => `- ${blocker.text}`)
          .join("\n")}`;
      }
    } else if (selectedProgress === "Weekly Progress") {
      text += `*Weekly Progress:*\n\n`;

      if (weeklyGoals.length > 0) {
        text += `*🎯 Goals:*\n${weeklyGoals
          .map(
            (goal) =>
              `- ${goal.text} (${
                goal.completed ? "(✅ Completed)" : "(❌ Incomplete)"
              })`
          )
          .join("\n")}\n\n`;
      }

      text += `*📊 Task Completion:* ${completedTasks}/${totalTasks}\n\n`;

      if (weeklyBlockers.length > 0) {
        text += `*🚧 Blockers:*\n${weeklyBlockers
          .map((blocker) => `- ${blocker.text}`)
          .join("\n")}`;
      }
    }

    try {
      const res = await fetch("/api/shareProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: "#test", // replace with your channel id
          text: text,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error);
      }

      // Display a success toast
      toast({
        title: "Share Successful",
        description: "Your progress has been successfully shared on Slack.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error(error);
      const errMsg = (error as Error).message || "An unknown error occurred";

      // Display the error message to the user with a toast
      toast({
        title: "Error",
        description: errMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Progress as {user?.displayName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl as="fieldset" mb={4}>
            <FormLabel as="legend" mb={2}>
              Select the progress to share:
            </FormLabel>
            <RadioGroup
              value={selectedProgress}
              onChange={(value: ProgressOption) => handleSelectProgress(value)}
            >
              <Stack direction="row" spacing={4}>
                {progressOptions.map((progress) => (
                  <Radio
                    key={progress}
                    value={progress}
                    cursor="pointer"
                    fontWeight={
                      selectedProgress === progress ? "bold" : "normal"
                    }
                  >
                    {progress}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
          {selectedProgress === "Daily Progress" && (
            <>
              <Text mb={2}>(💼 Scrum Master Format)</Text>
              <Box mb={4}>
                <Text mb={2}>✔️ Done: </Text>
                <UnorderedList pl={4}>
                  {yesterdayTasks.map((task) => (
                    <ListItem key={task.id}>
                      {task.text} (
                      {task.completed ? "✅ Completed" : "❌ Incomplete"})
                    </ListItem>
                  ))}
                </UnorderedList>
              </Box>
              <Box mb={4}>
                <Text mb={2}>📝 To do: </Text>
                <UnorderedList pl={4}>
                  {todayTasks.map((task) => (
                    <ListItem key={task.id}>{task.text}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
              <Box mb={4}>
                <Text mb={2}>🚧 Blockers: </Text>
                <UnorderedList pl={4}>
                  {blockers.map((blocker) => (
                    <ListItem key={blocker.id}>{blocker.text}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
            </>
          )}
          {selectedProgress === "Weekly Progress" && (
            <>
              <Box mb={4}>
                <Text mb={2}>🎯 Goals: </Text>
                <UnorderedList pl={4}>
                  {weeklyGoals.map((goal) => (
                    <ListItem key={goal.id}>
                      {goal.text} (
                      {goal.completed ? "✅ Completed" : "❌ Incomplete"})
                    </ListItem>
                  ))}
                </UnorderedList>
              </Box>
              <Box mb={4}>
                <Text mb={2}>
                  📊 Task Completion: {completedTasks}/{totalTasks}
                </Text>
              </Box>
              <Box mb={4}>
                <Text mb={2}>🚧 Blockers: </Text>
                <UnorderedList pl={4}>
                  {weeklyBlockers.map((blocker) => (
                    <ListItem key={blocker.id}>{blocker.text}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleShare} colorScheme="blue" mr={3}>
            Share
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareProgressModal;
