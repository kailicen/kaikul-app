import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { DayPicker } from "react-day-picker";
import { useState } from "react";
import { Task } from "@/atoms/tasksAtom";
import { SubGoal } from "@/atoms/goalsAtom";
import { format } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  subGoal: SubGoal;
  saveTask: (task: Task) => void;
};

const TaskDayPickerDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  subGoal,
  saveTask,
}) => {
  const [selectedDays, setSelectedDays] = useState<Date[]>([new Date()]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    const { text, priority, description, goalId, color, id } = subGoal;
    try {
      // Loop through each selected day and create a task
      for (const day of selectedDays) {
        const formattedDate = format(day, "yyyy-MM-dd");
        const taskToAdd: Task = {
          id: "", // Firestore will auto-generate this
          text,
          completed: false,
          date: formattedDate, // or however you decide to format your date
          priority,
          focusHours: 0, // This is set to 0 in your code, but adjust as needed
          description,
          goalId,
          color,
          subGoalId: id,
        };
        await saveTask(taskToAdd);
      }

      setSelectedDays([]);

      toast({
        title: "Tasks Added",
        description: "Tasks has been added to your selected days.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Error selecting the days:", error);

      toast({
        title: "Error",
        description: "An error occurred while adding the tasks",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Ensure loading state is reset in case of success or error
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Select Days for &quot;{subGoal.text}&quot;</DrawerHeader>
        <DrawerBody>
          <FormControl>
            <DayPicker
              mode="multiple"
              defaultMonth={new Date()}
              weekStartsOn={1}
              selected={selectedDays}
              onSelect={(days: Date[] | undefined) => {
                setSelectedDays(days || []);
              }}
            />
          </FormControl>
        </DrawerBody>
        <DrawerFooter>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            isDisabled={selectedDays.length === 0}
          >
            Add into my Weekly Planner
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TaskDayPickerDrawer;
