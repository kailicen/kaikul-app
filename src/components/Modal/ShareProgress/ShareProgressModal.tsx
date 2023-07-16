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
import * as clipboard from "clipboard-polyfill";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";

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

  const formattedDate = format(new Date(), "yyyy-MM-dd");

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

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData?.displayName || "");
        } else {
          setUsername(user.displayName || "");
        }
      };
      fetchUserData();
    }
  }, [user]);
  useEffect(() => {
    if (username === "") {
      setUsername(user?.email as string);
    }
  }, [username]);

  const handleShare = async () => {
    // Implement share function
    // Share the selectedProgress to Slack

    let text = `*Posted by ${username}*\n`;

    if (selectedProgress === "Daily Progress") {
      text += `*${formattedDate}:*\n`;

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

  const handleCopyToClipboard = async () => {
    if (!progressContainerRef.current) {
      console.error("No ref attached");
      return;
    }

    try {
      const dataUrl = await toPng(progressContainerRef.current);

      // Convert DataURL to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Check if the device is a mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Mobile: Provide a download link
        const blobUrl = URL.createObjectURL(blob);

        // Create a download link
        let a = document.createElement("a");
        a.href = blobUrl;
        a.download = "image.png";
        a.style.display = "none"; // Hide the link
        document.body.appendChild(a); // Append the link to the body
        a.click(); // Simulate a click

        // Cleanup: remove the link and revoke the blob URL
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } else {
        // Desktop: Use clipboard-polyfill to write the blob as an image to the clipboard
        await clipboard.write([
          new clipboard.ClipboardItem({ "Share-KaiKul/png": blob }),
        ]);
      }

      // Display a success toast
      toast({
        title: "Copy Successful",
        description:
          "Your progress has been successfully copied to the clipboard.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Image copied to clipboard");
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share as {username}</ModalHeader>
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
              <Text mb={4}>{formattedDate}:</Text>
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
              <Text fontSize="sm">
                This is the accountability partner platform powered by{" "}
                <Text as="b" color="purple.700">
                  KaiKul.com
                </Text>
              </Text>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCopyToClipboard} mr={3}>
            Copy to Clipboard
          </Button>
          <Button onClick={handleShare} mr={3}>
            Share to KaiKul Slack
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareProgressModal;
