import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  Text,
  Input,
  VStack,
  useColorMode,
  useMediaQuery,
  HStack,
  Icon,
  Tag,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useGoals } from "@/hooks/useGoals";
import { useWeeklyTasksAndGoals } from "@/hooks/useTasksAndGoals";
import { MdAdd } from "react-icons/md";
import { priorities } from "./Day";
import { Task } from "@/atoms/tasksAtom";
import SubGoalDrawer from "./DrawerComponents/SubGoalDrawer";
import useTasks from "@/hooks/useTasks";
import { v4 as uuidv4 } from "uuid";
import DraggableTask from "./DraggableComponents/DraggableTask";
import { useRecoilValue } from "recoil";
import { Goal, SubGoal } from "@/atoms/goalsAtom";

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
  const { goals, handleUpdateGoalAddTask } = useGoals(user, currentWeekStart);

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "gray.100" : "gray.700";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [subGoal, setSubGoal] = useState<SubGoal | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);

  const openSubGoalDrawer = (subGoal: SubGoal, goal: Goal) => {
    setSubGoal(subGoal);
    setGoal(goal);
    setDrawerOpen(true);
  };

  const closeSubGoalDrawer = () => {
    setSubGoal(null);
    setDrawerOpen(false);
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
        <VStack spacing={2} mt={2}>
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.600" : "gray.400"}
            textAlign="center"
            mb={4}
          >
            🚀 Drag & Drop subtasks into your weekly planner for easy
            scheduling! (Large screen)
          </Text>
          {goals && goals.length > 0 ? (
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
                  {!goal.subGoals ||
                  (goal.subGoals && goal.subGoals.length < 5) ? (
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
                  ) : (
                    <></>
                  )}

                  {/* If tasks are available, map through them and display */}
                  {goal.subGoals && goal.subGoals.length > 0 && (
                    <VStack spacing={1} mt={1} ml={3} w="100%">
                      {goal.subGoals.map((subGoal, index) => (
                        <DraggableTask key={index} subGoal={subGoal}>
                          <Box
                            key={index}
                            px={3}
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
                            <Text fontSize="sm">{subGoal.text}</Text>
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
                                mt={1}
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
      </Box>
    </>
  );
}

export default TaskSidePanel;
