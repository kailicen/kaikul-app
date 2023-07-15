import {
  Box,
  VStack,
  Text,
  Checkbox,
  Button,
  Icon,
  HStack,
  Textarea,
  Flex,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  DrawerCloseButton,
  Select,
  DrawerFooter,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps } from "formik";
import { MdAdd } from "react-icons/md";
import { useState } from "react";
import { User } from "firebase/auth";
import moment from "moment";
import useTasks from "@/hooks/useTasks";
import { useBlockers } from "@/hooks/useBlockers";
import { format, isToday, startOfWeek } from "date-fns";
import { useGoals } from "@/hooks/useGoals";

const Day: React.FC<{ date: string; user: User }> = ({ date, user }) => {
  const taskDrawerDisclosure = useDisclosure();
  const blockerDrawerDisclosure = useDisclosure();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskText, setSelectedTaskText] = useState("");
  const [selectedTaskDescription, setSelectedTaskDescription] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const [selectedBlockerId, setSelectedBlockerId] = useState<string | null>(
    null
  );
  const [selectedBlockerText, setSelectedBlockerText] = useState("");
  // Parse the date prop to a Date object
  const dateObj = new Date(date);
  const startOfWeekDate = startOfWeek(dateObj, { weekStartsOn: 1 });
  const startOfWeekString = format(startOfWeekDate, "yyyy-MM-dd");
  const toast = useToast();

  // Check if the current date prop corresponds to today
  const isCurrentDay = isToday(dateObj);

  const {
    tasks,
    handleAddTask,
    handleCompleteTask,
    handleEditTask,
    handleDeleteTask,
  } = useTasks(date, user);

  const { blockers, handleAddBlocker, handleEditBlocker, handleDeleteBlocker } =
    useBlockers(date, user);

  //use recoil state
  const { weeklyGoals } = useGoals(user, startOfWeekString);

  const openDrawer = (
    id?: string,
    text?: string,
    description?: string,
    goalId?: string
  ) => {
    taskDrawerDisclosure.onOpen();
    console.log(`goalid:${goalId}`);
    setSelectedTaskId(id || null);
    setSelectedTaskText(text || "");
    setSelectedTaskDescription(description || "");
    setSelectedGoalId(goalId || "");
  };

  const openBlockerDrawer = (id?: string, text?: string) => {
    blockerDrawerDisclosure.onOpen();
    setSelectedBlockerId(id || null);
    setSelectedBlockerText(text || "");
  };

  const handleFormSubmit = (values: {
    task: string;
    description: string;
    goalId: string;
  }) => {
    const selectedGoal = weeklyGoals.find((goal) => goal.id === values.goalId);
    const color = selectedGoal ? selectedGoal.color : ""; // Get the color from the selected goal

    if (selectedTaskId) {
      handleEditTask(
        selectedTaskId,
        values.task,
        values.description,
        values.goalId,
        color as string // Pass the color as an argument
      );
    } else {
      handleAddTask(
        values.task,
        values.description,
        values.goalId,
        color as string
      ); // Pass the color as an argument
    }
    taskDrawerDisclosure.onClose();
    setSelectedTaskId(null);
    setSelectedTaskText("");
  };

  const handleBlockerFormSubmit = (values: { blocker: string }) => {
    if (selectedBlockerId) {
      handleEditBlocker(selectedBlockerId, values.blocker);
    } else {
      handleAddBlocker(values.blocker);
    }
    blockerDrawerDisclosure.onClose();
    setSelectedBlockerId(null);
    setSelectedBlockerText("");
  };

  const handleDelete = (id: string) => {
    handleDeleteTask(id);
    toast({
      title: "Task deleted.",
      description: "Your task has been deleted successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    taskDrawerDisclosure.onClose();
  };

  const handleBlockerDelete = (id: string) => {
    handleDeleteBlocker(id);
    toast({
      title: "Reflection deleted.",
      description: "Your reflection has been deleted successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    blockerDrawerDisclosure.onClose();
  };

  return (
    <VStack
      align="stretch"
      minHeight="400px"
      border="1px"
      borderColor="gray.200"
      p={4}
      bg={isCurrentDay ? "purple.100" : undefined} // set a distinct background color for the current day
      mb={4} // add bottom margin
    >
      <Text fontSize="lg" fontWeight="semibold">
        {moment(date).format("ddd DD")}
      </Text>
      {/* task list */}
      {tasks.map((task) => (
        <Box
          key={task.id}
          p={2}
          borderRadius="md"
          boxShadow="md"
          _hover={{ boxShadow: "0 0 0 2px purple.400" }}
          bg={task.color ? task.color : "white"}
          position="relative"
          role="group"
          cursor="pointer"
          onClick={() =>
            openDrawer(task.id, task.text, task.description, task.goalId)
          }
        >
          <HStack spacing={2}>
            <Flex
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Checkbox
                isChecked={task.completed}
                onChange={(e) => {
                  handleCompleteTask(task.id);
                }}
              />
            </Flex>

            <Text fontSize="sm" flexGrow={1}>
              {task.text}
            </Text>
          </HStack>
        </Box>
      ))}
      {/* add a task */}
      <Flex align="center" gap={1}>
        {tasks.length < 5 && (
          <Icon
            as={MdAdd}
            color="gray.400"
            fontSize={20}
            cursor="pointer"
            onClick={() => openDrawer()}
          />
        )}{" "}
        {tasks.length === 0 && (
          <Text
            color="gray.400"
            fontSize="xs"
            cursor="pointer"
            onClick={() => openDrawer()}
          >
            Add a new task
          </Text>
        )}
      </Flex>
      <Drawer
        isOpen={taskDrawerDisclosure.isOpen}
        placement="right"
        onClose={taskDrawerDisclosure.onClose}
        size="md"
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {selectedTaskId ? "Edit Task" : "Add Task"}
            </DrawerHeader>
            <DrawerBody>
              <Formik
                initialValues={{
                  task: selectedTaskText,
                  description: selectedTaskDescription,
                  goalId: selectedGoalId as string,
                }}
                onSubmit={handleFormSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <Field
                      name="task"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <Input {...field} placeholder="New task..." />
                      )}
                    />
                    <Field
                      name="description"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <Textarea
                          {...field}
                          placeholder="Description..."
                          mt={4}
                        />
                      )}
                    />

                    <Field name="goalId">
                      {({
                        field,
                      }: {
                        field: FieldInputProps<any>;
                        form: any;
                      }) => (
                        <Box mt={4}>
                          <Select
                            {...field}
                            placeholder="Link with a goal (optional)"
                            value={selectedGoalId || ""} // Set the selected value
                            onChange={(e) => {
                              setFieldValue("goalId", e.target.value);
                            }}
                          >
                            {weeklyGoals.map((goal) => (
                              <option key={goal.id} value={goal.id}>
                                {goal.text}
                              </option>
                            ))}
                          </Select>
                        </Box>
                      )}
                    </Field>
                    <DrawerFooter>
                      <Button
                        mt={4}
                        colorScheme="blue"
                        isLoading={isSubmitting}
                        type="submit"
                      >
                        {selectedTaskId ? "Update" : "Add"}
                      </Button>
                      {selectedTaskId && (
                        <Button
                          mt={4}
                          ml={2}
                          variant="outline"
                          colorScheme="red"
                          onClick={() => handleDelete(selectedTaskId)}
                        >
                          Delete
                        </Button>
                      )}
                    </DrawerFooter>
                  </Form>
                )}
              </Formik>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      {/* New UI for blockers */}
      <Text fontSize="md" fontWeight="semibold">
        Reflection:
      </Text>
      {blockers.map((blocker) => (
        <Box
          key={blocker.id}
          p={2}
          bg={"yellow.200"}
          borderRadius="md"
          _hover={{ boxShadow: "0 0 0 2px purple.400" }}
          position="relative"
          role="group"
          boxShadow="md"
          cursor="pointer"
          onClick={() => openBlockerDrawer(blocker.id, blocker.text)}
        >
          <HStack spacing={2}>
            <Text fontSize="sm" flexGrow={1}>
              {blocker.text}
            </Text>
          </HStack>
        </Box>
      ))}
      {blockers.length < 1 && (
        <Flex align="center" gap={1}>
          <Icon
            as={MdAdd}
            color="gray.400"
            fontSize={20}
            cursor="pointer"
            onClick={() => openBlockerDrawer()}
          />
          <Text
            color="gray.400"
            fontSize="xs"
            cursor="pointer"
            onClick={() => openBlockerDrawer()}
          >
            Reflect on my day
          </Text>
        </Flex>
      )}
      <Drawer
        isOpen={blockerDrawerDisclosure.isOpen}
        placement="right"
        onClose={blockerDrawerDisclosure.onClose}
        size="md"
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {selectedBlockerId ? "Edit Reflection" : "Add Reflection"}
            </DrawerHeader>
            <DrawerBody>
              <Formik
                initialValues={{
                  blocker: selectedBlockerText,
                }}
                onSubmit={handleBlockerFormSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Field
                      name="blocker"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <Textarea
                          {...field}
                          placeholder="Reflect on my day..."
                        />
                      )}
                    />
                    <DrawerFooter>
                      <Button
                        mt={4}
                        colorScheme="blue"
                        isLoading={isSubmitting}
                        type="submit"
                      >
                        {selectedBlockerId ? "Update" : "Add"}
                      </Button>
                      {selectedBlockerId && (
                        <Button
                          mt={4}
                          ml={2}
                          variant="outline"
                          colorScheme="red"
                          onClick={() => handleBlockerDelete(selectedBlockerId)}
                        >
                          Delete
                        </Button>
                      )}
                    </DrawerFooter>
                  </Form>
                )}
              </Formik>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </VStack>
  );
};

export default Day;
