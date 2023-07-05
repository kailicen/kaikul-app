import {
  Box,
  VStack,
  Text,
  Checkbox,
  Button,
  InputGroup,
  InputRightElement,
  Icon,
  HStack,
  Spacer,
  Textarea,
  Flex,
  Editable,
  EditablePreview,
  EditableTextarea,
} from "@chakra-ui/react";
import { MdAddBox, MdDeleteForever, MdAdd } from "react-icons/md";
import { ChangeEvent, useState, useRef } from "react";
import { User } from "firebase/auth";
import moment from "moment";
import useTasks from "@/hooks/useTasks";
import { useBlockers } from "@/hooks/useBlockers";
import { isToday } from "date-fns";
import { EditableControls } from "./GoalView";

const Day: React.FC<{ date: string; user: User }> = ({ date, user }) => {
  const [showInput, setShowInput] = useState(false);
  const taskInputRef = useRef<HTMLTextAreaElement | null>(null);
  const taskAddButtonRef = useRef<HTMLButtonElement | null>(null);

  const [showBlockerInput, setShowBlockerInput] = useState(false);
  const blockerInputRef = useRef<HTMLTextAreaElement | null>(null);
  const blockerAddButtonRef = useRef<HTMLButtonElement | null>(null);

  // Parse the date prop to a Date object
  const dateObj = new Date(date);

  // Check if the current date prop corresponds to today
  const isCurrentDay = isToday(dateObj);

  const {
    tasks,
    newTask,
    setNewTask,
    handleAddTask,
    handleCompleteTask,
    handleEditTask,
    handleDeleteTask,
  } = useTasks(date, user);

  const {
    blockers,
    newBlocker,
    setNewBlocker,
    handleAddBlocker,
    handleEditBlocker,
    handleDeleteBlocker,
  } = useBlockers(date, user);

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
      {tasks.map((task, index) => (
        <Box
          key={index}
          p={2}
          m={1}
          borderRadius="md"
          bg={task.completed ? "blue.200" : "gray.100"}
          _hover={{ boxShadow: "0 0 0 2px purple.400" }}
          position="relative"
          role="group"
          boxShadow="md"
        >
          <HStack spacing={2}>
            <Checkbox
              isChecked={task.completed}
              onChange={() => handleCompleteTask(index)}
            ></Checkbox>
            <Editable
              fontSize="xs"
              defaultValue={task.text}
              onSubmit={(newValue) => handleEditTask(index, newValue)}
            >
              <EditablePreview />
              <EditableTextarea />
              <EditableControls />
            </Editable>

            <Spacer />
            <Icon
              as={MdDeleteForever}
              color="gray.500"
              fontSize={16}
              _hover={{ cursor: "pointer" }}
              onClick={() => handleDeleteTask(index)}
              position="absolute"
              right="2px"
              opacity="0"
              _groupHover={{ opacity: "1" }}
              transition="opacity 0.2s"
            />
          </HStack>
        </Box>
      ))}

      {/* add a task */}
      <InputGroup>
        {showInput && tasks.length < 3 ? (
          <>
            <Textarea
              ref={taskInputRef}
              placeholder="New task..."
              size="xs"
              value={newTask}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setNewTask(e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === "Enter" && newTask) {
                  handleAddTask();
                  setShowInput(false); // Hide input after task is added
                }
              }}
              onBlur={(e) => {
                if (e.relatedTarget !== taskAddButtonRef.current) {
                  setShowInput(false);
                }
              }}
            />
            <InputRightElement>
              <Button
                ref={taskAddButtonRef}
                variant="icon"
                onClick={() => {
                  handleAddTask();
                  setShowInput(false); // Hide input after task is added
                }}
                isDisabled={!newTask}
              >
                <Icon
                  as={MdAddBox}
                  color={newTask ? "purple.400" : "gray.400"}
                  fontSize={20}
                />
              </Button>
            </InputRightElement>
          </>
        ) : tasks.length < 3 ? (
          <Flex align="center" mt={1} mb={2}>
            <Button
              variant="icon"
              onClick={() => {
                setShowInput(true);
                setTimeout(() => taskInputRef.current?.focus(), 0); // set focus when the state has been updated
              }}
            >
              <Icon as={MdAdd} color="gray.400" fontSize={18} />
            </Button>
            {tasks.length === 0 && (
              <Text
                color="gray.400"
                fontSize="xs"
                cursor="pointer"
                onClick={() => {
                  setShowInput(true);
                  setTimeout(() => taskInputRef.current?.focus(), 0); // set focus when the state has been updated
                }}
              >
                Add a new task
              </Text>
            )}
          </Flex>
        ) : null}
      </InputGroup>

      {/* New UI for blockers */}
      <Text fontSize="md" fontWeight="semibold">
        Blockers:
      </Text>
      {blockers.map((blocker, index) => (
        <Box
          key={index}
          p={2}
          m={1}
          bg={"yellow.200"}
          borderRadius="md"
          _hover={{ boxShadow: "0 0 0 2px purple.400" }}
          position="relative"
          role="group"
          boxShadow="md"
        >
          <HStack spacing={2}>
            <Editable
              fontSize="xs"
              defaultValue={blocker.text}
              onSubmit={(newValue) => handleEditBlocker(index, newValue)}
            >
              <EditablePreview />
              <EditableTextarea />
            </Editable>
            <Spacer />
            <Icon
              as={MdDeleteForever}
              color="gray.500"
              fontSize={16}
              _hover={{ cursor: "pointer" }}
              onClick={() => handleDeleteBlocker(index)}
              position="absolute"
              right="2px"
              opacity="0"
              _groupHover={{ opacity: "1" }}
              transition="opacity 0.2s"
            />
          </HStack>
        </Box>
      ))}

      <InputGroup>
        {showBlockerInput && blockers.length < 1 ? (
          <>
            <Textarea
              ref={blockerInputRef}
              placeholder="New blocker..."
              size="xs"
              value={newBlocker}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setNewBlocker(e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === "Enter" && newBlocker) {
                  handleAddBlocker();
                  setShowBlockerInput(false); // Hide input after blocker is added
                }
              }}
              onBlur={(e) => {
                if (e.relatedTarget !== blockerAddButtonRef.current) {
                  setShowBlockerInput(false);
                }
              }}
              autoFocus
            />
            <InputRightElement>
              <Button
                ref={blockerAddButtonRef}
                variant="icon"
                onClick={() => {
                  handleAddBlocker();
                  setShowBlockerInput(false); // Hide input after blocker is added
                }}
                isDisabled={!newBlocker}
              >
                <Icon
                  as={MdAddBox}
                  color={newBlocker ? "purple.400" : "gray.400"}
                  fontSize={20}
                />
              </Button>
            </InputRightElement>
          </>
        ) : blockers.length < 1 ? (
          <Flex align="center" mt={1} mb={2}>
            <Button
              variant="icon"
              onClick={() => {
                setShowBlockerInput(true);
                setTimeout(() => blockerInputRef.current?.focus(), 0); // set focus when the state has been updated
              }}
            >
              <Icon as={MdAdd} color="gray.400" fontSize={18} />
            </Button>
            {blockers.length === 0 && (
              <Text
                color="gray.400"
                fontSize="xs"
                cursor="pointer"
                onClick={() => {
                  setShowBlockerInput(true);
                  setTimeout(() => blockerInputRef.current?.focus(), 0); // set focus when the state has been updated
                }}
              >
                Add a new blocker
              </Text>
            )}
          </Flex>
        ) : null}
      </InputGroup>
    </VStack>
  );
};

export default Day;
