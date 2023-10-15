import React, { useState, useEffect } from "react";
import {
  Text,
  Box,
  Center,
  Flex,
  Grid,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  Spacer,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Icon,
  Textarea,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  DrawerFooter,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { MdAdd } from "react-icons/md";
import { useGoals } from "@/hooks/useGoals";
import { Formik, Field, Form, FieldInputProps, ErrorMessage } from "formik";
import { CirclePicker } from "react-color";
import { ChevronDownIcon, InfoIcon } from "@chakra-ui/icons";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaCalendarAlt } from "react-icons/fa";
import GoalSettingModal from "@/components/Modal/Instructions/GoalSettingModal";
import { startOfWeek, format, isBefore } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import GoalDrawer from "./DrawerComponents/GoalDrawer";
import TaskSidePanel from "./TaskSidePanel";

type GoalViewProps = {
  user: User;
  currentDayStart: string;
  currentWeekStart: string;
  onTogglePanel: () => void; // Added prop
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function GoalView({
  user,
  currentDayStart,
  currentWeekStart,
  onTogglePanel,
  isPanelOpen,
  setIsPanelOpen,
}: GoalViewProps) {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [mobileStartOfWeek, setMobileStartOfWeek] = useState(currentWeekStart);
  const toast = useToast();

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!isLargerThan768) {
      const startOfDayZoned = utcToZonedTime(
        new Date(currentDayStart),
        userTimeZone
      );
      const startOfWeekDate = startOfWeek(startOfDayZoned, { weekStartsOn: 1 });
      setMobileStartOfWeek(format(startOfWeekDate, "yyyy-MM-dd"));
    } else {
      setMobileStartOfWeek(currentWeekStart);
    }
  }, [isLargerThan768, currentDayStart, currentWeekStart]);

  const {
    goals,
    handleAddGoal,
    handleCompleteGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  } = useGoals(user, isLargerThan768 ? currentWeekStart : mobileStartOfWeek);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoalText, setSelectedGoalText] = useState("");
  const [selectedGoalCompleted, setSelectedGoalCompleted] = useState(false);
  const [selectedGoalDescription, setSelectedGoalDescription] = useState("");
  const [selectedGoalColor, setSelectedGoalColor] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd")); // Defaults to current date as a formatted string
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const [startDisplayedMonth, setStartDisplayedMonth] = useState<Date>(
    new Date()
  );
  const [endDisplayedMonth, setEndDisplayedMonth] = useState<Date>(new Date());

  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };

  const openDrawer = (
    id?: string,
    text?: string,
    completed?: boolean,
    description?: string,
    color?: string,
    startDate?: string,
    endDate?: string
  ) => {
    onOpen();
    setSelectedGoalId(id || null);
    setSelectedGoalText(text || "");
    setSelectedGoalCompleted(completed || false);
    setSelectedGoalDescription(description || "");
    setSelectedGoalColor(color || "white");
    setStartDate(startDate || format(new Date(), "yyyy-MM-dd"));
    setEndDate(endDate || "");

    if (startDate) {
      setStartDisplayedMonth(new Date(startDate));
    } else {
      setStartDisplayedMonth(new Date());
    }
    if (endDate) {
      setEndDisplayedMonth(new Date(endDate));
    } else {
      setEndDisplayedMonth(new Date());
    }
  };

  const handleFormSubmit = (values: {
    goal: string;
    description: string;
    color: string;
    startDate: string;
    endDate: string;
  }) => {
    if (selectedGoalId) {
      handleUpdateGoal(
        selectedGoalId,
        values.goal,
        values.description,
        values.color,
        values.startDate,
        values.endDate
      );
      toast({
        title: "Goal updated.",
        description: "Your goal has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      handleAddGoal(
        values.goal,
        values.description,
        values.color,
        values.startDate,
        values.endDate
      );
      toast({
        title: "Goal added.",
        description: "Your goal has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
    setSelectedGoalId(null);
    setSelectedGoalText("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      handleDeleteGoal(id);
      toast({
        title: "Goal deleted.",
        description: "Your goal has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <Center width="100%">
      <Box width="100%" p={2}>
        <Text mb={2} fontWeight="semibold">
          Goal Setting:{" "}
          <Button onClick={onTogglePanel} mb={1} ml={1}>
            Toggle Task Panel
          </Button>
          {/* <Button
            leftIcon={<InfoIcon />}
            colorScheme="purple"
            variant="ghost"
            onClick={handleInstructionOpen}
            mb={1}
          >
            Get a Goal Guide
          </Button> */}
        </Text>
        {/* Use the modal component here */}
        <GoalSettingModal
          isOpen={isInstructionOpen}
          onClose={handleInstructionClose}
        />
        {!isPanelOpen && (
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={3}>
            {goals.map((goal) => (
              <Flex
                key={goal.id}
                px={4}
                py={2}
                align="center"
                borderRadius="md"
                boxShadow="md"
                _hover={{ boxShadow: "0 0 0 2px purple.400" }}
                cursor="pointer"
                bg={goal.color}
                color="black"
                onClick={() =>
                  openDrawer(
                    goal.id,
                    goal.text,
                    goal.completed,
                    goal.description,
                    goal.color,
                    goal.startDate,
                    goal.endDate
                  )
                }
              >
                <Text fontSize="sm" fontWeight="semibold" flexGrow={1}>
                  {goal.text}
                </Text>
                {goal.completed && (
                  <Badge ml="1" h="5">
                    done
                  </Badge>
                )}
              </Flex>
            ))}
            <Flex align="center">
              <Icon
                as={MdAdd}
                color="gray.400"
                fontSize={26}
                cursor="pointer"
                onClick={() => openDrawer()}
              />
            </Flex>
          </Grid>
        )}
      </Box>
      <GoalDrawer
        isOpen={isOpen}
        onClose={onClose}
        selectedGoalId={selectedGoalId as string}
        selectedGoalText={selectedGoalText}
        selectedGoalDescription={selectedGoalDescription}
        selectedGoalColor={selectedGoalColor}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate as string}
        setEndDate={setEndDate}
        handleFormSubmit={handleFormSubmit}
        startDisplayedMonth={startDisplayedMonth}
        setStartDisplayedMonth={setStartDisplayedMonth}
        endDisplayedMonth={endDisplayedMonth}
        setEndDisplayedMonth={setEndDisplayedMonth}
        selectedGoalCompleted={selectedGoalCompleted}
        setSelectedGoalCompleted={setSelectedGoalCompleted}
        handleCompleteGoal={handleCompleteGoal}
        handleDelete={handleDelete}
      />

      {/* Ensure the TaskSidePanel is outside the VStack to not squeeze itself */}
      {isPanelOpen && (
        <TaskSidePanel
          user={user}
          currentWeekStart={currentWeekStart}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
          openDrawer={openDrawer}
        />
      )}
    </Center>
  );
}

export default GoalView;
