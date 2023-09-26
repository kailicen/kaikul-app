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
  useBreakpointValue,
  List,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useProgress, { ProgressOption } from "@/hooks/useProgress";
import { endOfWeek, startOfWeek } from "date-fns";
import { toPng } from "html-to-image";
import * as clipboard from "clipboard-polyfill";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";
import useUserPoints from "@/hooks/useUserPoints";
import { User } from "firebase/auth";
import { utcToZonedTime, format } from "date-fns-tz";

type ShareProgressModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ShareProgressModal: React.FC<ShareProgressModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedProgress, setSelectedProgress] =
    useState<ProgressOption>("Daily Sprint");

  const isDesktopOrLaptop = useBreakpointValue({ base: false, md: true });

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
    "Daily Sprint",
    "Weekly Reflection",
  ];

  // Get the user's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get the current date in the user's timezone
  const nowInUserTz = utcToZonedTime(new Date(), userTimeZone);

  const formattedDate = format(nowInUserTz, "EEEE, MMM do, yyyy", {
    timeZone: userTimeZone,
  });

  // Get the start (Monday) and end (Sunday) of the week
  const startInUTC = startOfWeek(nowInUserTz, { weekStartsOn: 1 });
  const endInUTC = endOfWeek(nowInUserTz, { weekStartsOn: 1 });

  // Convert these UTC dates to the user's timezone and then format
  const formattedStart = format(
    utcToZonedTime(startInUTC, userTimeZone),
    "MMM do",
    { timeZone: userTimeZone }
  );
  const formattedEnd = format(
    utcToZonedTime(endInUTC, userTimeZone),
    "MMM do, yyyy",
    { timeZone: userTimeZone }
  );

  const { user, yesterdayTasks, todayTasks, blockers, weeklyReflection } =
    useProgress(selectedProgress, lastOpened);
  const { updatePoints } = useUserPoints(user as User);

  const toast = useToast();
  const { colorMode } = useColorMode();

  const progressContainerRef = useRef(null);

  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const screenshotInstructions = "Please screenshot to share on mobile";

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
    setIsLoading(true);

    let text = `*Posted by ${username}*\n`;

    if (selectedProgress === "Daily Sprint") {
      text += `*${formattedDate}:*\n`;

      if (yesterdayTasks.length > 0) {
        text += `*Tracker (yesterday): *\n${yesterdayTasks
          .map((task) => `${task.completed ? "✅" : "❌"} ${task.text}`)
          .join("\n")}\n\n`;
      }

      if (blockers.length > 0) {
        text += `*Reflection (yesterday):*\n${blockers
          .map((blocker) => `- ${blocker.text}`)
          .join("\n")}\n\n`;
      }

      if (todayTasks.length > 0) {
        text += `*To do (today):*\n${todayTasks
          .map((task) => `- ${task.text}`)
          .join("\n")}`;
      }
    } else if (selectedProgress === "Weekly Reflection") {
      text += `*${formattedStart} - ${formattedEnd}:*\n\n`;
      text += `*Week Rating*: ${weeklyReflection?.rateWeek}/10\n`;
      text += `*Happiness Rating*: ${weeklyReflection?.rateHappiness}/10\n`;
      text += `*Practice Hours*: ${weeklyReflection?.practiceHours}\n`;
      text += `*Biggest improvement*: \n${weeklyReflection?.biggestImprovement}\n`;
      text += `*Biggest obstacle*: \n${weeklyReflection?.biggestObstacle}\n`;
      text += `*Lesson Learned*: \n${weeklyReflection?.lessonLearned}\n\n`;
    }

    const pointsToAdd = 1;
    await updatePoints(pointsToAdd);

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

      setIsLoading(false);
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
      setIsLoading(false);

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
      // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // if (isMobile) {
      //   // Mobile: Provide a download link
      //   const blobUrl = URL.createObjectURL(blob);

      //   // Create a download link
      //   let a = document.createElement("a");
      //   a.href = blobUrl;
      //   a.download = "image.png";
      //   a.style.display = "none"; // Hide the link
      //   document.body.appendChild(a); // Append the link to the body
      //   a.click(); // Simulate a click

      //   // Cleanup: remove the link and revoke the blob URL
      //   document.body.removeChild(a);
      //   URL.revokeObjectURL(blobUrl);
      // } else {
      // Desktop: Use clipboard-polyfill to write the blob as an image to the clipboard
      await clipboard.write([
        new clipboard.ClipboardItem({ "image/png": blob }),
      ]);
      //}

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
      toast({
        title: "Fail to process",
        description: "Please contact KaiKul team for further assistance.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Failed to copy", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isDesktopOrLaptop ? "Share" : screenshotInstructions}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody ref={progressContainerRef}>
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
          {selectedProgress === "Daily Sprint" && (
            <>
              <Text mb={4}>{formattedDate}:</Text>
              <Box mb={4}>
                <Text mb={2}>Tracker (yesterday): </Text>
                <List pl={4}>
                  {yesterdayTasks.map((task) => (
                    <ListItem key={task.id}>
                      {task.completed ? "✅" : "❌"} {task.text}
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box mb={4}>
                <Text mb={2}>Reflection (yesterday): </Text>
                <UnorderedList pl={4}>
                  {blockers.map((blocker) => (
                    <ListItem key={blocker.id}>{blocker.text}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
              <Box mb={4}>
                <Text mb={2}>To do (today): </Text>
                <UnorderedList pl={4}>
                  {todayTasks.map((task) => (
                    <ListItem key={task.id}>{task.text}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
              <Text fontSize="sm">
                This is the accountability partner platform powered by{" "}
                <Text
                  as="b"
                  color={colorMode === "light" ? "brand.500" : "brand.200"}
                >
                  KaiKul.com
                </Text>
              </Text>
            </>
          )}
          {selectedProgress === "Weekly Reflection" && (
            <>
              <Text mb={4}>
                {formattedStart} - {formattedEnd}:
              </Text>
              <Box mb={4}>
                <Box display="flex" alignItems="center" mt={4} gap={2}>
                  <Text fontWeight="semibold">Week Rating:</Text>
                  <Text> {weeklyReflection?.rateWeek}/10</Text>
                </Box>
                <Box display="flex" alignItems="center" mt={4} gap={2}>
                  <Text fontWeight="semibold">Happiness Rating:</Text>
                  <Text> {weeklyReflection?.rateHappiness}/10</Text>
                </Box>
                <Box display="flex" alignItems="center" mt={4} gap={2}>
                  <Text fontWeight="semibold">Practice Hours:</Text>
                  <Text> {weeklyReflection?.practiceHours}</Text>
                </Box>
                <Box display="flex" flexDirection="column" gap={1} mt={4}>
                  <Text fontWeight="semibold">Biggest improvement:</Text>
                  <Text> {weeklyReflection?.biggestImprovement}</Text>
                </Box>
                <Box display="flex" flexDirection="column" gap={1} mt={4}>
                  <Text fontWeight="semibold">Biggest obstacle:</Text>
                  <Text> {weeklyReflection?.biggestObstacle}</Text>
                </Box>
                <Box display="flex" flexDirection="column" gap={1} mt={4}>
                  <Text fontWeight="semibold">Lesson Learned:</Text>
                  <Text> {weeklyReflection?.lessonLearned}</Text>
                </Box>
              </Box>

              <Text fontSize="sm">
                This is the accountability partner platform powered by{" "}
                <Text
                  as="b"
                  color={colorMode === "light" ? "brand.500" : "brand.200"}
                >
                  KaiKul.com
                </Text>
              </Text>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {isDesktopOrLaptop && (
            <Button onClick={handleCopyToClipboard} mr={3}>
              Copy to Clipboard
            </Button>
          )}

          <Button onClick={handleShare} mr={3} isLoading={isLoading}>
            Share to KaiKul Slack
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareProgressModal;
