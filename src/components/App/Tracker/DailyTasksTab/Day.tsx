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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tag,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, ErrorMessage } from "formik";
import { MdAdd } from "react-icons/md";
import { useCallback, useEffect, useRef, useState } from "react";
import { User } from "firebase/auth";
import useTasks from "@/hooks/useTasks";
import { useBlockers } from "@/hooks/useReflections";
import { format, startOfWeek } from "date-fns";
import { useGoals } from "@/hooks/useGoals";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaCalendarAlt } from "react-icons/fa";
import { utcToZonedTime } from "date-fns-tz";
import { Task } from "@/atoms/tasksAtom";
import { useDrop } from "react-dnd";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";

export const priorities = [
  { value: "1", label: "High", emoji: "🏔️" },
  { value: "2", label: "Medium", emoji: "🏕️" },
  { value: "3", label: "Low", emoji: "🏖️" },
];

const Day: React.FC<{ date: string; user: User }> = ({ date, user }) => {
  const taskDrawerDisclosure = useDisclosure();
  const blockerDrawerDisclosure = useDisclosure();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskText, setSelectedTaskText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedFocusHours, setSelectedFocusHours] = useState(0);
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
  const adjustedDate = new Date(`${date}T12:00:00`); // Set to noon
  const dateObj = utcToZonedTime(new Date(adjustedDate), userTimeZone);
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
  const [duplicateValues, setDuplicateValues] = useState<Task | null>(null);

  const { colorMode } = useColorMode();

  const dateRef = useRef<string>();

  useEffect(() => {
    // Always keep the most recent value of date in the ref
    dateRef.current = date;
  }, [date]);

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
  const { recoilGoals } = useGoals(user, startOfWeekString);

  const openDrawer = (
    date: string,
    id?: string,
    text?: string,
    priority?: string,
    focusHours?: number,
    description?: string,
    goalId?: string
  ) => {
    taskDrawerDisclosure.onOpen();
    setTaskDate(date);
    setSelectedTaskId(id || null);
    setSelectedTaskText(text || "");
    setSelectedPriority(priority || "");
    setSelectedFocusHours(focusHours || 0);
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
    priority: string;
    focusHours: number;
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
          values.priority === "" ? "9" : values.priority,
          values.focusHours,
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
          values.priority === "" ? "9" : values.priority,
          values.focusHours,
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
      text: selectedTaskText,
      priority: selectedPriority,
      focusHours: selectedFocusHours,
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

  const handleDrop = useCallback(
    async (item: { task: Task }) => {
      console.log(`date:${dateRef.current}`);
      const { goalId, id: id } = item.task;

      try {
        // Query for the task in Firestore
        if (!goalId || !id) {
          console.error("Undefined goalId or taskId");
          return; // Exit early if either is not defined
        }

        const taskDocRef = doc(firestore, "weeklyGoals", goalId);
        const taskSnapshot = await getDoc(taskDocRef);

        if (taskSnapshot.exists()) {
          const goalData = taskSnapshot.data();
          const taskData = goalData?.tasks?.find(
            (task: Task) => task.id === id
          );

          if (taskData) {
            handleAddTask(
              taskData.text,
              taskData.priority,
              0,
              taskData.description || "",
              taskData.goalId as string,
              dateRef.current as string,
              taskData.color || "white"
            );
          } else {
            console.error(`Task with id ${id} not found.`);
          }
        }
      } catch (error) {
        console.error("Error fetching task: ", error);
      }
    },
    [date, handleAddTask, firestore]
  ); // include all dependencies used within the handler

  useEffect(() => {
    if (!taskDrawerDisclosure.isOpen) {
      setDuplicateValues(null);
    }
  }, [taskDrawerDisclosure.isOpen]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <VStack
      ref={drop}
      align="stretch"
      width="100%"
      height="550px"
      maxHeight="calc(100vh - 200px)"
      overflowY="auto"
      border={isOver ? "2px" : "1px"}
      borderColor={
        isOver ? "purple.500" : colorMode === "light" ? "gray.200" : "gray.700"
      }
      bg={
        isCurrentDay
          ? colorMode === "light"
            ? "#cfccd3"
            : "gray.700"
          : colorMode === "light"
          ? "white"
          : "gray.800"
      }
      p={2}
      mb={4} // add bottom margin
      spacing={1}
    >
      <Text fontSize="lg" fontWeight="semibold">
        {format(dateObj, "eee dd")}
      </Text>
      {/* task list */}

      {tasks.map((task) => (
        <Box
          key={task.id}
          py={1}
          px={2}
          borderRadius="md"
          boxShadow="md"
          _hover={{ boxShadow: "0 0 0 2px purple.400" }}
          bg={task.color ? task.color : "white"}
          color="black"
          position="relative"
          role="group"
          cursor="pointer"
          onClick={() => {
            openDrawer(
              task.date,
              task.id,
              task.text,
              task.priority,
              task.focusHours,
              task.description,
              task.goalId
            );
          }}
        >
          <VStack align="left" spacing={0}>
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
                    handleCompleteTask(task.id as string);
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
            {/* Additional Task Information: Priority and Focus Hours */}
            <HStack spacing={1} mt={1}>
              {task.priority && task.priority !== "9" && (
                <Tag
                  colorScheme={colorMode === "light" ? "gray" : "black"}
                  size="sm"
                  variant="solid"
                  borderRadius="full"
                  whiteSpace="nowrap"
                  isTruncated
                >
                  {priorities
                    .filter((p) => p.value === task.priority?.toString())
                    .map((p) => (
                      <>
                        {p.emoji} {p.label}
                      </>
                    ))}
                </Tag>
              )}
              {task.focusHours && (
                <Tag
                  colorScheme={colorMode === "light" ? "gray" : "black"}
                  size="sm"
                  variant="solid"
                  borderRadius="full"
                  whiteSpace="nowrap"
                  isTruncated
                >
                  {task.focusHours} hrs
                </Tag>
              )}
            </HStack>
          </VStack>
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
                    ? duplicateValues.text
                    : selectedTaskText,
                  priority: duplicateValues
                    ? (duplicateValues.priority as string)
                    : selectedPriority,
                  focusHours: duplicateValues
                    ? (duplicateValues.focusHours as number)
                    : selectedFocusHours,
                  description: duplicateValues
                    ? (duplicateValues.description as string)
                    : selectedTaskDescription,
                  goalId: duplicateValues
                    ? (duplicateValues.goalId as string)
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
                            <FormLabel mb="0">Task Date</FormLabel>
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
                                        new Date(`${field.value[0]}T12:00:00`),
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
                                        ? [new Date(`${field.value}T12:00:00`)]
                                        : field.value?.length
                                        ? field.value.map(
                                            (date: string) =>
                                              new Date(`${date}T12:00:00`)
                                          )
                                        : [
                                            utcToZonedTime(
                                              new Date(),
                                              userTimeZone
                                            ),
                                          ]
                                    }
                                    onSelect={(
                                      selectedDays: Date[] | Date | undefined
                                    ) => {
                                      if (selectedDays) {
                                        // Directly use the date strings returned from the date picker
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
                                        console.log(
                                          "Selected Date:",
                                          formattedDates
                                        );

                                        // Convert to the user's timezone when setting the readable date strings
                                        const dateStrings = Array.isArray(
                                          selectedDays
                                        )
                                          ? selectedDays.map((day) =>
                                              format(
                                                utcToZonedTime(
                                                  day,
                                                  userTimeZone
                                                ),
                                                "MMMM d, yyyy"
                                              )
                                            )
                                          : [
                                              format(
                                                utcToZonedTime(
                                                  selectedDays as Date,
                                                  userTimeZone
                                                ),
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

                    <Field name="priority">
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
                            <FormLabel mb="0">Priority</FormLabel>
                            <Select
                              {...field}
                              maxW="150px"
                              borderRadius="full"
                              placeholder="Optional"
                              value={field.value} // Set the selected value
                              onChange={(e) => {
                                setFieldValue("priority", e.target.value);
                              }}
                            >
                              {priorities.map((priority) => (
                                <option
                                  key={priority.value}
                                  value={priority.value}
                                >
                                  {priority.emoji} {priority.label}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      )}
                    </Field>

                    <Field name="focusHours">
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
                            <FormLabel mb="0">Track Focus Hours</FormLabel>
                            <NumberInput
                              maxW="100px"
                              value={field.value} // Use field.value from Formik
                              placeholder="e.g., 2"
                              min={0}
                              step={0.5}
                              onChange={(valueString) => {
                                form.setFieldValue(
                                  "focusHours",
                                  parseFloat(valueString) // Parse as a floating-point number
                                ); // Use Formik’s setFieldValue to ensure updates
                              }}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
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
