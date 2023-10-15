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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useGoals } from "@/hooks/useGoals";
import { useWeeklyTasksAndGoals } from "@/hooks/useTasksAndGoals";
import { MdAdd } from "react-icons/md";
import { priorities } from "./Day";
import { Task } from "@/atoms/tasksAtom";
import BreakdownTaskDrawer from "./DrawerComponents/BreakdownTaskDrawer";
import useTasks from "@/hooks/useTasks";
import { v4 as uuidv4 } from "uuid";

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
  const [plannedTask, setPlannedTask] = useState<Task>({
    text: "",
    date: "",
    priority: "9",
  });

  const openTaskDrawer = (task: Task) => {
    setPlannedTask(task);
    setDrawerOpen(true);
  };

  const closeTaskDrawer = () => {
    setPlannedTask({ text: "", date: "", priority: "9" });
    setDrawerOpen(false);
  };

  const saveTask = async (task: Task) => {
    try {
      // Check if goalId is available
      if (!task.goalId) {
        console.error("Task does not have an associated goalId");
        return;
      }

      // Retrieve the goal using goalId
      const associatedGoal = goals.find((goal) => goal.id === task.goalId);

      if (!associatedGoal) {
        console.error(`No goal found with id ${task.goalId}`);
        return;
      }

      // Determine whether we're adding or editing a task
      let newTasks;
      if (task.id) {
        // Editing an existing task
        newTasks = associatedGoal.tasks?.map(
          (existingTask) =>
            existingTask.id === task.id
              ? task // replace the existing task with the updated task
              : existingTask // leave the task as it is
        ) ?? [task]; // if for some reason tasks are undefined/null, set newTasks to an array with the new task
      } else {
        // Adding a new task
        const newTask = {
          ...task,
          id: uuidv4(), // Assigning a unique id to the new task
        };
        // Adding a new task
        newTasks = associatedGoal.tasks
          ? [...associatedGoal.tasks, newTask]
          : [newTask];
      }

      // Update the goal with the new task array using handleUpdateGoalAddTask
      await handleUpdateGoalAddTask(task.goalId, newTasks);

      console.log("Task saved successfully");
    } catch (error) {
      console.error("Error while saving task:", error);
    }
  };

  const deleteTask = async (taskId: string, goalId: string) => {
    try {
      // Validate inputs
      if (!goalId || !taskId) {
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
      const newTasks =
        associatedGoal.tasks?.filter((task) => task.id !== taskId) ?? [];

      // Update the goal with the new task array using handleUpdateGoalAddTask
      await handleUpdateGoalAddTask(goalId, newTasks);

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
                  {!goal.tasks || (goal.tasks && goal.tasks.length < 5) ? (
                    <Icon
                      as={MdAdd}
                      color={colorMode === "light" ? "gray.400" : "gray.400"}
                      fontSize={20}
                      cursor="pointer"
                      onClick={() =>
                        openTaskDrawer({
                          text: "",
                          date: currentWeekStart,
                          priority: "9",
                          description: "",
                          goalId: goal.id,
                          color: goal.color,
                          isPlanned: true,
                        })
                      }
                      mt={2}
                    />
                  ) : (
                    <></>
                  )}

                  {/* If tasks are available, map through them and display */}
                  {goal.tasks && goal.tasks.length > 0 && (
                    <VStack spacing={1} mt={1} ml={3} w="100%">
                      {goal.tasks.map((task, index) => (
                        <Box
                          key={index}
                          px={3}
                          py={1}
                          borderRadius="md"
                          boxShadow="sm"
                          bgColor={task.color || "white"} // Applying color
                          color="black"
                          _hover={{ boxShadow: "md" }}
                          cursor="pointer"
                          onClick={() => {
                            openTaskDrawer(task);
                          }}
                          w="100%"
                        >
                          <Text fontSize="sm">{task.text}</Text>
                          {task.priority && task.priority !== "9" && (
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
                                  (p) => p.value === task.priority?.toString()
                                )
                                .map((p) => (
                                  <>
                                    {p.emoji} {p.label}
                                  </>
                                ))}
                            </Tag>
                          )}
                        </Box>
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
        <BreakdownTaskDrawer
          isOpen={drawerOpen}
          onClose={closeTaskDrawer}
          task={plannedTask}
          saveTask={saveTask}
          deleteTask={deleteTask}
        />
      </Box>
    </>
  );
}

export default TaskSidePanel;
