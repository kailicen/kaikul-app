import {
  Drawer,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useToast,
  Textarea,
  Popover,
  PopoverTrigger,
  Icon,
  PopoverContent,
  PopoverBody,
  Box,
  FormHelperText,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { priorities } from "../Day";
import { FaCalendarAlt } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Goal, SubGoal } from "@/atoms/goalsAtom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  subGoal: SubGoal;
  goal: Goal;
  saveSubGoal: (subGoal: SubGoal) => void;
  deleteSubGoal: (id: string, goalId: string) => void;
};

const SubGoalDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  subGoal: subGoal,
  goal: goal,
  saveSubGoal: saveSubGoal,

  deleteSubGoal: deleteSubGoal,
}) => {
  const [localSubGoal, setLocalSubGoal] = useState<SubGoal>(subGoal);
  const toast = useToast();

  const [errors, setErrors] = useState<{
    text?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  // Initialize startDate and endDate from the subGoal prop
  const [startDate, setStartDate] = useState(
    new Date(subGoal.startDate || Date.now())
  ); // if no startDate is provided, default to today
  const [endDate, setEndDate] = useState(
    subGoal.endDate ? new Date(subGoal.endDate) : undefined
  );

  // Convert goal's startDate and endDate strings to Date objects
  const goalStartDate = new Date(goal.startDate);
  const goalEndDate = new Date(goal.endDate);

  const [isStartDatePopoverOpen, setStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setEndDatePopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDateSelect = (selectedDay: Date | undefined) => {
    if (selectedDay) {
      const formattedDate = format(selectedDay, "yyyy-MM-dd");
      setStartDate(selectedDay);
      setLocalSubGoal({ ...localSubGoal, startDate: formattedDate });
      setStartDatePopoverOpen(false); // Close popover

      // Check if the new start date is after the previously selected end date
      if (endDate && selectedDay > endDate) {
        // Reset the end date
        setEndDate(undefined);
        setLocalSubGoal({
          ...localSubGoal,
          startDate: formattedDate,
          endDate: "",
        });
      }
    }
  };

  const handleEndDateSelect = (selectedDay: Date | undefined) => {
    if (selectedDay && (endDate === undefined || selectedDay >= startDate)) {
      const formattedDate = format(selectedDay, "yyyy-MM-dd");
      setEndDate(selectedDay);
      setLocalSubGoal({ ...localSubGoal, endDate: formattedDate });
      setEndDatePopoverOpen(false); // Close popover

      // Clear the error for endDate
      if (errors.endDate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          endDate: undefined,
        }));
      }
    }
  };

  useEffect(() => {
    // Initialize localTask when task prop changes
    setLocalSubGoal(subGoal);
  }, [subGoal]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name as keyof typeof errors; // Narrow down the type
    const value = e.target.value;

    setLocalSubGoal({ ...localSubGoal, [name]: value });

    // Clear the error for the current input field
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const { endDate, text } = localSubGoal;

    let errorState = {};
    if (!text) errorState = { ...errorState, text: "Text is required!" };
    if (!endDate)
      errorState = { ...errorState, endDate: "End date is required!" };

    if (Object.keys(errorState).length > 0) {
      setErrors(errorState);
      setIsLoading(false);
      return; // Exit the function to prevent submitting
    }
    try {
      // If priority is an empty string, set it to "9"
      const finalSubGoal = {
        ...localSubGoal,
        priority: localSubGoal.priority === "" ? "9" : localSubGoal.priority,
      };

      // Assuming saveTask might be an async function
      await saveSubGoal(finalSubGoal);

      // Showing a success toast
      toast({
        title: "Sub Goal Saved",
        description: "Your sub goal has been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Closing the drawer
      onClose();
    } catch (error) {
      // Handling error and showing an error toast
      console.error("Error saving the task:", error);

      toast({
        title: "Error",
        description: "An error occurred while saving your sub goal.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Ensure loading state is reset in case of success or error
    }
  };

  const handleDelete = async (id: string, goalId: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        // Logic to delete the task
        await deleteSubGoal(id, goalId);
        // Showing a success toast
        toast({
          title: "Sub Goal Deleted",
          description: "Your sub goal has been deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Closing the drawer
        onClose();
      } catch (error) {
        // Handling error and showing an error toast
        console.error("Error saving the sub goal:", error);

        toast({
          title: "Error",
          description: "An error occurred while deleting your sub goal.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {subGoal.id ? "Edit Sub Goal" : "Add Sub Goal"}
        </DrawerHeader>
        <DrawerBody>
          <FormControl>
            <Input
              name="text"
              placeholder="What is a sub target of my primary goal?"
              value={localSubGoal.text}
              onChange={handleChange}
            />
            {errors.text && (
              <FormHelperText color="red.500">{errors.text}</FormHelperText>
            )}
          </FormControl>
          <Box mt={4}>
            <FormControl display="flex" alignItems="center" mt={4}>
              <FormLabel mb="0">Start Date:</FormLabel>
              <Popover
                isOpen={isStartDatePopoverOpen}
                onClose={() => setStartDatePopoverOpen(false)}
              >
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    leftIcon={<Icon as={FaCalendarAlt} />}
                    onClick={() => setStartDatePopoverOpen(true)}
                  >
                    {format(startDate, "yyyy-MM-dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <DayPicker
                      mode="single"
                      defaultMonth={startDate}
                      weekStartsOn={1}
                      selected={startDate}
                      onSelect={handleStartDateSelect}
                      disabled={(day: Date) =>
                        day < goalStartDate ||
                        (endDate ? day > endDate : day > goalEndDate)
                      }
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <FormHelperText color="red.500" mb={1} ml={2}>
                  {errors.startDate}
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          <Box mt={4}>
            <FormControl display="flex" alignItems="center" mt={4}>
              <FormLabel mb="0">End Date:</FormLabel>
              <Popover
                isOpen={isEndDatePopoverOpen}
                onClose={() => setEndDatePopoverOpen(false)}
              >
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    leftIcon={<Icon as={FaCalendarAlt} />}
                    onClick={() => setEndDatePopoverOpen(true)}
                  >
                    {endDate
                      ? format(endDate, "yyyy-MM-dd")
                      : "Select End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <DayPicker
                      mode="single"
                      defaultMonth={endDate || startDate}
                      weekStartsOn={1}
                      disabled={(day: Date) =>
                        day < startDate || day > goalEndDate
                      }
                      selected={endDate}
                      onSelect={handleEndDateSelect}
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <FormHelperText color="red.500" mb={1} ml={2}>
                  {errors.endDate}
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          <FormControl mt={4}>
            <Textarea
              name="description"
              placeholder="What are some action steps? "
              value={localSubGoal.description}
              onChange={handleChange}
              rows={7}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Priority</FormLabel>
            <Select
              name="priority"
              value={localSubGoal.priority}
              placeholder="Optional"
              onChange={handleChange}
            >
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.emoji} {priority.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Save Sub Goal
          </Button>
          {subGoal.id ? (
            <Button
              ml={2}
              variant="outline"
              _hover={{ bgColor: "red.500", color: "white" }}
              onClick={() =>
                handleDelete(subGoal.id as string, subGoal.goalId as string)
              }
            >
              Delete
            </Button>
          ) : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SubGoalDrawer;
