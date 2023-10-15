import { Task } from "@/atoms/tasksAtom";
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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { priorities } from "../Day";

type TaskDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  saveTask: (task: Task) => void;
  deleteTask: (taskId: string, goalId: string) => void;
};

const BreakdownTaskDrawer: React.FC<TaskDrawerProps> = ({
  isOpen,
  onClose,
  task,
  saveTask,
  deleteTask,
}) => {
  const [localTask, setLocalTask] = useState<Task>(task);
  const toast = useToast();

  useEffect(() => {
    // Initialize localTask when task prop changes
    setLocalTask(task);
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setLocalTask({ ...localTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // If priority is an empty string, set it to "9"
      const finalTask = {
        ...localTask,
        priority: localTask.priority === "" ? "9" : localTask.priority,
      };

      // Assuming saveTask might be an async function
      await saveTask(finalTask);

      // Showing a success toast
      toast({
        title: "Task Saved",
        description: "Your task has been saved successfully.",
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
        description: "An error occurred while saving your task.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (taskId: string, goalId: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        // Logic to delete the task
        await deleteTask(taskId, goalId);
        // Showing a success toast
        toast({
          title: "Task Deleted",
          description: "Your task has been deleted successfully.",
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
          description: "An error occurred while deleting your task.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{task.id ? "Edit Task" : "Add Task"}</DrawerHeader>
        <DrawerBody>
          <FormControl>
            <FormLabel>Task Name</FormLabel>
            <Input name="text" value={localTask.text} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={localTask.description}
              onChange={handleChange}
              rows={7}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Priority</FormLabel>
            <Select
              name="priority"
              value={localTask.priority}
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
          <Button onClick={handleSubmit}>Save Task</Button>
          {task.id ? (
            <Button
              ml={2}
              variant="outline"
              _hover={{ bgColor: "red.500", color: "white" }}
              onClick={() =>
                handleDelete(task.id as string, task.goalId as string)
              }
            >
              Delete Task
            </Button>
          ) : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BreakdownTaskDrawer;
