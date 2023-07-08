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
  RadioGroup,
  Radio,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useProgress, { ProgressOption } from "@/hooks/useProgress";
import { format } from "date-fns";
import { toPng } from "html-to-image";

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

  const progressContainerRef = useRef(null);

  const handleShare = async () => {
    // Implement share function
    // Share the selectedProgress to Slack

    const userName = user?.displayName; // replace with the actual user's name
    let text = `*Posted by ${userName}*\n`;

    if (selectedProgress === "Daily Progress") {
      text += `*${dayOfWeek}'s Sprint:*\n`;

      if (yesterdayTasks.length > 0) {
        text += `*✔️ Done:*\n${yesterdayTasks
          .map((task) => `- ${task.text} ${task.completed ? "✅" : "❌"}`)
          .join("\n")}\n\n`;
      }

      if (blockers.length > 0) {
        text += `*💡 Reflection:*\n${blockers
          .map((blocker) => `- ${blocker.text}`)
          .join("\n")}\n\n`;
      }

      if (todayTasks.length > 0) {
        text += `*📝 To do:*\n${todayTasks
          .map((task) => `- ${task.text}`)
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
        text += `*💡 Reflection:*\n${weeklyBlockers
          .map((blocker) => `- ${blocker.text}`)
          .join("\n")}`;
      }

      text += `\n\nThis is the accountability partner platform powered by [KaiKul](http://kaikul.com/).`;
    }

    try {
      const res = await fetch("/api/shareProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: "#daily-sprint", // replace with your channel id
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

  const handleExportAsImage = () => {
    const node = progressContainerRef.current;

    if (!node) {
      console.error("Could not find the element to export");
      return;
    }

    toPng(node)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "kaikul-sprint.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("oops, something went wrong!", error);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share</ModalHeader>
        <ModalCloseButton />
        <ModalBody ref={progressContainerRef} bg="white">
          <FormControl as="fieldset" mb={4}>
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
              <Box mb={4}>
                <Text mb={2}>✔️ Track yesterday: </Text>
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
                <Text mb={2}>💡 Reflection: </Text>
                <UnorderedList pl={4}>
                  {blockers.map((blocker) => (
                    <ListItem key={blocker.id}>{blocker.text}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
              <Box mb={4}>
                <Text mb={2}>📝 To do for today: </Text>
                <UnorderedList pl={4}>
                  {todayTasks.map((task) => (
                    <ListItem key={task.id}>{task.text}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
              <Text fontSize="sm">
                This is the accountability partner platform powered by{" "}
                <Text as="b" color="purple.700">
                  KaiKul.com
                </Text>
              </Text>
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
                <Text mb={2}>💡 Reflection: </Text>
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
          <Button onClick={handleExportAsImage} colorScheme="blue" mr={3}>
            Export as Image
          </Button>
          <Button onClick={handleShare} colorScheme="blue" mr={3}>
            Share to KaiKul Slack
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareProgressModal;
