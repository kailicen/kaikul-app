import {
  Box,
  CloseButton,
  Flex,
  Text,
  VStack,
  useColorMode,
  useMediaQuery,
  HStack,
  Icon,
  Tag,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useGoals } from "@/hooks/useGoals";
import { MdAdd, MdOutlineDragIndicator } from "react-icons/md";
import { priorities } from "./Day";
import { Task } from "@/atoms/tasksAtom";
import SubGoalDrawer from "./DrawerComponents/SubGoalDrawer";
import { v4 as uuidv4 } from "uuid";
import DraggableTask from "./DraggableComponents/DraggableTask";
import { Goal, SubGoal } from "@/atoms/goalsAtom";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { FaCalendarAlt } from "react-icons/fa";
import TaskDayPickerDrawer from "./DrawerComponents/TaskDayPickerDrawer";

type Props = {
  user: User;
  currentWeekStart: string;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openDrawer: (
    id: string,
    text: string,
    completed: boolean,
    description: string,
    color: string,
    startDate: string,
    endDate: string
  ) => void;
};

function TaskSidePanel({
  user,
  currentWeekStart,
  isPanelOpen,
  setIsPanelOpen,
  openDrawer,
}: Props) {
  //const { structuredGoals } = useWeeklyTasksAndGoals(user, currentWeekStart);
  const { goals, handleUpdateGoalAddTask, loading } = useGoals(
    user,
    currentWeekStart
  );

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "gray.100" : "gray.700";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [subGoal, setSubGoal] = useState<SubGoal | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);

  const displayText = isLargerThan768
    ? "🚀 Drag & Drop subgoals into your weekly planner for easy scheduling!"
    : "Click on the calendar icon to add subgoals into your weekly planner. (🚀 Large screen has drag and drop function)";

  const openSubGoalDrawer = (subGoal: SubGoal, goal: Goal) => {
    setSubGoal(subGoal);
    setGoal(goal);
    setDrawerOpen(true);
  };

  const openTaskDayPickerDrawer = (subGoal: SubGoal) => {
    setSubGoal(subGoal);
    setTaskDrawerOpen(true);
  };

  const closeSubGoalDrawer = () => {
    setSubGoal(null);
    setDrawerOpen(false);
  };

  const closeTaskDayPickerDrawer = () => {
    setSubGoal(null);
    setTaskDrawerOpen(false);
  };

  const saveSubGoal = async (subGoal: SubGoal) => {
    try {
      // Check if goalId is available
      if (!subGoal.goalId) {
        console.error("Task does not have an associated goalId");
        return;
      }

      // Retrieve the goal using goalId
      const associatedGoal = goals.find((goal) => goal.id === subGoal.goalId);

      if (!associatedGoal) {
        console.error(`No goal found with id ${subGoal.goalId}`);
        return;
      }

      // Determine whether we're adding or editing a task
      let newSubGoals: SubGoal[];
      if (subGoal.id) {
        // Editing an existing task
        newSubGoals = associatedGoal.subGoals?.map(
          (existingSubGoal) =>
            existingSubGoal.id === subGoal.id
              ? subGoal // replace the existing task with the updated task
              : existingSubGoal // leave the task as it is
        ) ?? [subGoal]; // if for some reason tasks are undefined/null, set newSubGoals to an array with the new task
      } else {
        // Adding a new task
        const newSubGoal = {
          ...subGoal,
          id: uuidv4(), // Assigning a unique id to the new task
          userId: user.uid,
        };
        // Adding a new task
        newSubGoals = associatedGoal.subGoals
          ? [...associatedGoal.subGoals, newSubGoal]
          : [newSubGoal];
      }

      // Update the goal with the new task array using handleUpdateGoalAddTask
      await handleUpdateGoalAddTask(subGoal.goalId, newSubGoals);

      console.log("Sub-goal saved successfully");
    } catch (error) {
      console.error("Error while saving task:", error);
    }
  };

  const saveTask = async (task: Task) => {
    try {
      // Spread the properties of the task and add the userId property
      const taskWithUserId = { ...task, userId: user.uid };

      const docRef = await addDoc(
        collection(firestore, "tasks"),
        taskWithUserId
      );
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const deleteSubGoal = async (id: string, goalId: string) => {
    try {
      // Validate inputs
      if (!goalId || !id) {
        console.error("Missing goalId or taskId");
        return;
      }

      // Retrieve the goal using goalId
      const associatedGoal = goals.find((goal) => goal.id === goalId);

      if (!associatedGoal) {
        console.error(`No goal found with id ${goalId}`);
        return;
      }

      // Filter out the task to be deleted
      const newSubGoals =
        associatedGoal.subGoals?.filter((subGoal) => subGoal.id !== id) ?? [];

      // Update the goal with the new task array using handleUpdateGoalAddTask
      await handleUpdateGoalAddTask(goalId, newSubGoals);

      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error while deleting task:", error);
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  useEffect(() => {
    // Check if is mobile view and panel is open
    if (window.innerWidth <= 768 && isPanelOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    // Cleanup to enable scrolling when component unmounts or panel closes
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isPanelOpen]);

  return (
    <>
      <Box
        width={isLargerThan768 ? "300px" : "100%"} // full width on mobile
        height="calc(100vh - 65px)" // calculate height
        backgroundColor={bgColor}
        position="fixed"
        top="65px"
        left={isPanelOpen ? 0 : isLargerThan768 ? "-300px" : "-100%"} // adjust hiding position
        py={2}
        px={4}
        boxShadow="lg"
        transition="left 0.3s ease-in-out"
        zIndex={isPanelOpen ? 2 : 0}
        overflowY="auto"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="semibold">
            Break Down Goals
          </Text>
          <CloseButton onClick={togglePanel} />
        </Flex>
        <VStack spacing={2} mt={2} mb={16}>
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.600" : "gray.400"}
            textAlign="center"
            mb={4}
          >
            {displayText}
          </Text>

          {/* Spinner for loading state */}
          {loading ? (
            <Flex justify="center" align="center" height="100%">
              <Spinner size="xl" />
            </Flex>
          ) : goals && goals.length > 0 ? (
            goals.map((goal) => (
              <Box key={goal.id} w="100%">
                <Box
                  px={4}
                  py={2}
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
                      goal.description || "",
                      goal.color || "white",
                      goal.startDate,
                      goal.endDate
                    )
                  }
                >
                  <Text fontSize="sm" fontWeight="semibold" flexGrow={1}>
                    {goal.text}
                  </Text>
                </Box>

                <HStack align="top">
                  <Icon
                    as={MdAdd}
                    color={colorMode === "light" ? "gray.400" : "gray.400"}
                    fontSize={20}
                    cursor="pointer"
                    onClick={() =>
                      openSubGoalDrawer(
                        {
                          id: "",
                          text: "",
                          startDate: "",
                          endDate: "",
                          priority: "9",
                          description: "",
                          goalId: goal.id,
                          color: goal.color as string,
                        },
                        goal
                      )
                    }
                    mt={2}
                  />

                  {/* If tasks are available, map through them and display */}
                  {goal.subGoals && goal.subGoals.length > 0 && (
                    <VStack spacing={1} mt={1} ml={3} w="100%">
                      {goal.subGoals.map((subGoal, index) => (
                        <DraggableTask key={subGoal.id} subGoal={subGoal}>
                          <Box
                            key={index}
                            px={2}
                            py={1}
                            borderRadius="md"
                            boxShadow="sm"
                            bgColor={subGoal.color || "white"} // Applying color
                            color="black"
                            _hover={{ boxShadow: "md" }}
                            cursor="pointer"
                            onClick={() => {
                              openSubGoalDrawer(subGoal, goal);
                            }}
                            w="100%"
                          >
                            {/* Drag handle icon */}
                            <Flex align="center">
                              {isLargerThan768 ? (
                                <Icon as={MdOutlineDragIndicator} />
                              ) : (
                                <Icon
                                  as={FaCalendarAlt}
                                  color="gray.800"
                                  mr={1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openTaskDayPickerDrawer(subGoal);
                                  }}
                                />
                              )}
                              <Text fontSize="sm" ml={1}>
                                {subGoal.text}
                              </Text>
                            </Flex>
                            <HStack spacing={1} mt={1} pl={3}>
                              {subGoal.priority && subGoal.priority !== "9" && (
                                <Tag
                                  colorScheme={
                                    colorMode === "light" ? "gray" : "black"
                                  }
                                  size="sm"
                                  variant="solid"
                                  borderRadius="full"
                                  whiteSpace="nowrap"
                                  isTruncated
                                >
                                  {priorities
                                    .filter(
                                      (p) =>
                                        p.value === subGoal.priority?.toString()
                                    )
                                    .map((p) => (
                                      <>
                                        {p.emoji} {p.label}
                                      </>
                                    ))}
                                </Tag>
                              )}
                              {subGoal.totalHours && (
                                <Tag
                                  colorScheme={
                                    colorMode === "light" ? "gray" : "black"
                                  }
                                  size="sm"
                                  variant="solid"
                                  borderRadius="full"
                                  whiteSpace="nowrap"
                                  isTruncated
                                >
                                  {subGoal.totalHours} hrs
                                </Tag>
                              )}
                            </HStack>
                          </Box>
                        </DraggableTask>
                      ))}
                    </VStack>
                  )}
                </HStack>
              </Box>
            ))
          ) : (
            <Text>No goals found</Text>
          )}
        </VStack>
        {subGoal && goal && (
          <SubGoalDrawer
            isOpen={drawerOpen}
            onClose={closeSubGoalDrawer}
            subGoal={subGoal}
            goal={goal}
            saveSubGoal={saveSubGoal}
            deleteSubGoal={deleteSubGoal}
          />
        )}
        {subGoal && (
          <TaskDayPickerDrawer
            isOpen={taskDrawerOpen}
            onClose={closeTaskDayPickerDrawer}
            subGoal={subGoal}
            saveTask={saveTask}
          />
        )}
      </Box>
    </>
  );
}

export default TaskSidePanel;
