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
  FormControl,
  FormLabel,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorMode,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, ErrorMessage } from "formik";
import { MdAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import useTasks from "@/hooks/useTasks";
import { useBlockers } from "@/hooks/useReflections";
import { format, startOfWeek } from "date-fns";
import { useGoals } from "@/hooks/useGoals";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaCalendarAlt } from "react-icons/fa";
import { utcToZonedTime } from "date-fns-tz";

const Day: React.FC<{ date: string; user: User }> = ({ date, user }) => {
  const taskDrawerDisclosure = useDisclosure();
  const blockerDrawerDisclosure = useDisclosure();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskText, setSelectedTaskText] = useState("");
  const [selectedTaskDescription, setSelectedTaskDescription] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [taskDate, setTaskDate] = useState<string>("");
  const [selectedDateStrings, setSelectedDateStrings] = useState<string[]>([]);

  const [selectedBlockerId, setSelectedBlockerId] = useState<string | null>(
    null
  );
  const [selectedBlockerText, setSelectedBlockerText] = useState("");

  // Get the user's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Parse the date prop to a Date object and adjust to user's timezone
  const dateObj = utcToZonedTime(new Date(date), userTimeZone);
  const todayInUserTimeZone = utcToZonedTime(new Date(), userTimeZone);

  // Adjust the dateObj to the start of day in user's timezone
  const dateObjStartOfDay = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  );

  // Adjust today's date to the start of day in user's timezone
  const todayStartOfDay = new Date(
    todayInUserTimeZone.getFullYear(),
    todayInUserTimeZone.getMonth(),
    todayInUserTimeZone.getDate()
  );

  const isCurrentDay =
    dateObjStartOfDay.getTime() === todayStartOfDay.getTime();

  const startOfWeekDate = startOfWeek(dateObj, { weekStartsOn: 1 });
  const startOfWeekString = format(startOfWeekDate, "yyyy-MM-dd");
  const toast = useToast();

  const [isTaskDatePopoverOpen, setTaskDatePopoverOpen] = useState(false);
  const [taskDisplayedMonth, setTaskDisplayedMonth] = useState(new Date());

  const [ifDuplicate, setIfDuplicate] = useState<boolean>(false);
  const [duplicateValues, setDuplicateValues] = useState<{
    task: string;
    description: string;
    goalId: string;
    date: string;
  } | null>(null);

  const { colorMode } = useColorMode();

  const {
    tasks,
    setTasks,
    handleAddTask,
    handleCompleteTask,
    handleEditTask,
    handleDeleteTask,
  } = useTasks(date, user);

  const { blockers, handleAddBlocker, handleEditBlocker, handleDeleteBlocker } =
    useBlockers(date, user);

  //use recoil state
  const { recoilGoals } = useGoals(user, startOfWeekString);

  const openDrawer = (
    date: string,
    id?: string,
    text?: string,
    description?: string,
    goalId?: string
  ) => {
    taskDrawerDisclosure.onOpen();
    setTaskDate(date);
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
    date: string[]; // Change the type of date to an array of strings
  }) => {
    const selectedGoal = recoilGoals.find((goal) => goal.id === values.goalId);
    const color = selectedGoal ? selectedGoal.color : ""; // Get the color from the selected goal

    values.date.forEach((date) => {
      // Loop over each date in the array
      if (selectedTaskId) {
        handleEditTask(
          selectedTaskId,
          values.task,
          values.description,
          values.goalId,
          date, // Pass the current date in the loop
          color as string // Pass the color as an argument
        );
        toast({
          title: "Task updated.",
          description: `Your task for date ${date} has been updated successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        handleAddTask(
          values.task,
          values.description,
          values.goalId,
          date, // Pass the current date in the loop
          color as string // Pass the color as an argument
        );
        toast({
          title: "Task added.",
          description: `Your task for date ${date} has been added successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    });
    taskDrawerDisclosure.onClose();
    setSelectedTaskId(null);
    setSelectedTaskText("");
    setIfDuplicate(false);
  };

  const handleDuplicate = () => {
    setSelectedTaskId(null);
    setIfDuplicate(true);

    taskDrawerDisclosure.onClose();
    const valuesToDuplicate = {
      task: selectedTaskText,
      description: selectedTaskDescription,
      goalId: selectedGoalId as string,
      date: taskDate,
    };

    // Set the values to be duplicated
    setDuplicateValues(valuesToDuplicate);

    // Wait a moment for the drawer to fully close, then reopen it
    setTimeout(() => {
      taskDrawerDisclosure.onOpen();
    }, 200); // 200ms should be enough, but you can adjust as needed
  };

  const handleBlockerFormSubmit = (values: { blocker: string }) => {
    if (selectedBlockerId) {
      handleEditBlocker(selectedBlockerId, values.blocker);
      toast({
        title: "Reflection updated.",
        description: "Your reflection has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      handleAddBlocker(values.blocker);
      toast({
        title: "Reflection added.",
        description: "Your reflection has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    blockerDrawerDisclosure.onClose();
    setSelectedBlockerId(null);
    setSelectedBlockerText("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      handleDeleteTask(id);
      toast({
        title: "Task deleted.",
        description: "Your task has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      taskDrawerDisclosure.onClose();
    }
  };

  const handleBlockerDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this reflection?")) {
      handleDeleteBlocker(id);
      toast({
        title: "Reflection deleted.",
        description: "Your reflection has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      blockerDrawerDisclosure.onClose();
    }
  };

  useEffect(() => {
    if (!taskDrawerDisclosure.isOpen) {
      setDuplicateValues(null);
    }
  }, [taskDrawerDisclosure.isOpen]);

  return (
    <VStack
      align="stretch"
      width="100%"
      minHeight="400px"
      border="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      bg={
        isCurrentDay
          ? colorMode === "light"
            ? "#cfccd3"
            : "gray.700"
          : colorMode === "light"
          ? "white"
          : "gray.800"
      }
      p={3}
      mb={4} // add bottom margin
    >
      <Text fontSize="lg" fontWeight="semibold">
        {format(dateObj, "eee dd")}
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
          color="black"
          position="relative"
          role="group"
          cursor="pointer"
          onClick={() =>
            openDrawer(
              task.date,
              task.id,
              task.text,
              task.description,
              task.goalId
            )
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
                colorScheme="gray"
                sx={{
                  ".chakra-checkbox__control": {
                    borderColor: "gray.700",
                    _checked: {
                      borderColor: "gray.500",
                      bg: "gray.500",
                    },
                    _hover: {
                      borderColor: "gray.600",
                    },
                  },
                }}
                onChange={(e) => {
                  handleCompleteTask(task.id);
                }}
              />
            </Flex>

            <Text
              fontSize="sm"
              flexGrow={1}
              textDecoration={task.completed ? "line-through" : "none"}
            >
              {task.text}
            </Text>
          </HStack>
        </Box>
      ))}
      {/* add a task */}
      <Flex align="center" gap={1}>
        {tasks.length < 10 && (
          <Icon
            as={MdAdd}
            color={
              isCurrentDay
                ? colorMode === "light"
                  ? "#342552"
                  : "gray.200"
                : colorMode === "light"
                ? "gray.400"
                : "gray.400"
            }
            fontSize={20}
            cursor="pointer"
            onClick={() => openDrawer(date)}
          />
        )}{" "}
        {tasks.length === 0 && (
          <Text
            color={
              isCurrentDay
                ? colorMode === "light"
                  ? "#342552"
                  : "gray.200"
                : colorMode === "light"
                ? "gray.400"
                : "gray.400"
            } // set a distinct background color for the current day
            fontSize="xs"
            cursor="pointer"
            onClick={() => openDrawer(date)}
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
              {selectedTaskId
                ? "Edit Task"
                : ifDuplicate
                ? "Duplicate Task"
                : "Add Task"}
            </DrawerHeader>
            <DrawerBody>
              <Formik
                initialValues={{
                  task: duplicateValues
                    ? duplicateValues.task
                    : selectedTaskText,
                  description: duplicateValues
                    ? duplicateValues.description
                    : selectedTaskDescription,
                  goalId: duplicateValues
                    ? duplicateValues.goalId
                    : (selectedGoalId as string),
                  date: duplicateValues ? [duplicateValues.date] : [taskDate],
                }}
                onSubmit={handleFormSubmit}
                validate={(values) => {
                  const errors: any = {};
                  if (!values.task.trim()) {
                    errors.task = "Task is required";
                  }
                  return errors;
                }}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <Field
                      name="task"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <div>
                          <Input {...field} placeholder="New task..." />
                          <ErrorMessage
                            name="task"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      )}
                    />

                    <Field name="date">
                      {({
                        field,
                        form,
                      }: {
                        field: FieldInputProps<any>;
                        form: any;
                      }) => (
                        <Box mt={4}>
                          <FormControl
                            display="flex"
                            alignItems="center"
                            mt={4}
                          >
                            <FormLabel mb="0">Task Date:</FormLabel>
                            <Popover
                              isOpen={isTaskDatePopoverOpen}
                              onClose={() => {
                                setTaskDatePopoverOpen(false);
                                // Optionally reset the selectedDateStrings state when the popover is closed
                                setSelectedDateStrings([]);
                              }}
                            >
                              <PopoverTrigger>
                                <Button
                                  variant="outline"
                                  leftIcon={<Icon as={FaCalendarAlt} />}
                                  onClick={() => setTaskDatePopoverOpen(true)}
                                >
                                  {selectedTaskId
                                    ? format(
                                        new Date(field.value[0]),
                                        "MMMM d, yyyy"
                                      )
                                    : field.value.length > 0
                                    ? `${field.value.length} dates selected`
                                    : "Select Task Dates"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverBody>
                                  <DayPicker
                                    mode={
                                      selectedTaskId ? "single" : "multiple"
                                    }
                                    weekStartsOn={1}
                                    month={taskDisplayedMonth}
                                    onMonthChange={(month: Date) =>
                                      setTaskDisplayedMonth(month)
                                    }
                                    selected={
                                      selectedTaskId
                                        ? [new Date(field.value)]
                                        : field.value?.length
                                        ? field.value.map(
                                            (date: string) => new Date(date)
                                          )
                                        : [new Date()]
                                    }
                                    onSelect={(
                                      selectedDays: Date[] | Date | undefined
                                    ) => {
                                      if (selectedDays) {
                                        const formattedDates = Array.isArray(
                                          selectedDays
                                        )
                                          ? selectedDays.map((day) =>
                                              format(day, "yyyy-MM-dd")
                                            )
                                          : [
                                              format(
                                                selectedDays as Date,
                                                "yyyy-MM-dd"
                                              ),
                                            ];
                                        form.setFieldValue(
                                          "date",
                                          formattedDates
                                        );

                                        // Update the readable date strings state
                                        const dateStrings = Array.isArray(
                                          selectedDays
                                        )
                                          ? selectedDays.map((day) =>
                                              format(day, "MMMM d, yyyy")
                                            )
                                          : [
                                              format(
                                                selectedDays as Date,
                                                "MMMM d, yyyy"
                                              ),
                                            ];
                                        setSelectedDateStrings(dateStrings);

                                        if (selectedTaskId) {
                                          setTaskDatePopoverOpen(false);
                                        }
                                      }
                                    }}
                                  />

                                  {/* Display the list of selected dates in a readable format */}
                                  {selectedDateStrings.length > 0 && (
                                    <Box mt={2}>
                                      <Text fontWeight="bold">
                                        Selected Dates:
                                      </Text>
                                      <UnorderedList>
                                        {selectedDateStrings.map(
                                          (dateStr, index) => (
                                            <ListItem key={index}>
                                              {dateStr}
                                            </ListItem>
                                          )
                                        )}
                                      </UnorderedList>
                                    </Box>
                                  )}
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                        </Box>
                      )}
                    </Field>

                    <Field
                      name="description"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <Textarea
                          {...field}
                          placeholder="Description..."
                          mt={4}
                          rows={10}
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
                            value={field.value} // Set the selected value
                            onChange={(e) => {
                              setFieldValue("goalId", e.target.value);
                            }}
                          >
                            {recoilGoals.map((goal) => (
                              <option key={goal.id} value={goal.id}>
                                {goal.text}
                              </option>
                            ))}
                          </Select>
                        </Box>
                      )}
                    </Field>
                    <DrawerFooter>
                      {selectedTaskId && (
                        <Button mt={4} onClick={handleDuplicate}>
                          Duplicate
                        </Button>
                      )}
                      <Button
                        ml={2}
                        mt={4}
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
                          _hover={{ bgColor: "red.500", color: "white" }}
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
          bg={colorMode === "light" ? "brand.50" : "brand.50"}
          color="black"
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
            color={
              isCurrentDay
                ? colorMode === "light"
                  ? "#342552"
                  : "gray.200"
                : colorMode === "light"
                ? "gray.400"
                : "gray.400"
            }
            fontSize={20}
            cursor="pointer"
            onClick={() => openBlockerDrawer()}
          />
          <Text
            color={
              isCurrentDay
                ? colorMode === "light"
                  ? "#342552"
                  : "gray.200"
                : colorMode === "light"
                ? "gray.400"
                : "gray.400"
            }
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
                validate={(values) => {
                  const errors: any = {};
                  if (!values.blocker.trim()) {
                    errors.blocker = "Reflection is required";
                  }
                  return errors;
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Field
                      name="blocker"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <div>
                          <Textarea
                            {...field}
                            placeholder="What went well, what didn't go well, and how can you improve?"
                            rows={10}
                          />
                          <ErrorMessage
                            name="blocker"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
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
                          _hover={{ bgColor: "red.500", color: "white" }}
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
