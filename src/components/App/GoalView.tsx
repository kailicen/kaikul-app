import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  InputGroup,
  InputRightElement,
  Box,
  Icon,
  Center,
  Input,
  Editable,
  EditablePreview,
  Flex,
  Grid,
  EditableTextarea,
  useEditableControls,
  ButtonGroup,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { MdAdd, MdAddBox, MdCheck, MdDelete } from "react-icons/md";
import { useGoals } from "@/hooks/useGoals";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import moment from "moment";

export function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="xs">
      <IconButton
        icon={<CheckIcon />}
        aria-label="Submit"
        {...getSubmitButtonProps()}
      />
      <IconButton
        icon={<CloseIcon />}
        aria-label="Cancel"
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <></>
  );
}

type GoalViewProps = { user: User; startOfDay: string; startOfWeek: string };

function GoalView({ user, startOfDay, startOfWeek }: GoalViewProps) {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const goalInputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
  const goalAddButtonRef = useRef<HTMLButtonElement>(null);

  const [mobileStartOfWeek, setMobileStartOfWeek] = useState(startOfWeek);

  useEffect(() => {
    if (!isLargerThan768) {
      const startOfWeekMoment = moment(startOfDay).startOf("week");
      setMobileStartOfWeek(startOfWeekMoment.format("YYYY-MM-DD"));
    } else {
      setMobileStartOfWeek(startOfWeek);
    }
  }, [isLargerThan768, startOfDay, startOfWeek]);

  const {
    goals,
    newGoal,
    setNewGoal,
    handleAddGoal,
    handleCompleteGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  } = useGoals(user, isLargerThan768 ? startOfWeek : mobileStartOfWeek);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        goalInputRef.current &&
        !goalInputRef.current.contains(event.target as Node) &&
        !goalAddButtonRef.current?.contains(event.target as Node)
      ) {
        setShowInput(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <Center>
      <Box width="100%" p={4}>
        <Text mb={2} fontWeight="semibold">
          My Weekly Goals:{" "}
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={3}>
          {goals.map((goal, index) => (
            <Flex
              key={index}
              px={3}
              py={1}
              shadow="sm"
              borderWidth="1px"
              borderRadius="md"
              _hover={{ shadow: "md" }}
            >
              <Box flexGrow={1}>
                <Editable
                  defaultValue={goal.text}
                  fontSize="sm"
                  onSubmit={(newText) => handleUpdateGoal(index, newText)}
                  flex={1} // add this
                >
                  <EditablePreview
                    style={{
                      textDecoration: goal.completed ? "line-through" : "none",
                      cursor: "pointer",
                    }}
                  />
                  <EditableTextarea
                    style={{
                      textDecoration: goal.completed ? "line-through" : "none",
                    }}
                  />
                  <EditableControls />
                </Editable>
              </Box>

              <Flex align="center" justify="center" gap={2}>
                <Icon
                  as={MdCheck}
                  aria-label="Mark as done"
                  fontSize={16}
                  color={goal.completed ? "green.600" : "gray.600"}
                  cursor="pointer"
                  onClick={() => handleCompleteGoal(index)}
                />

                <Icon
                  as={MdDelete}
                  aria-label="Delete"
                  fontSize={16}
                  color="gray.500"
                  cursor="pointer"
                  onClick={() => handleDeleteGoal(index)}
                />
              </Flex>
            </Flex>
          ))}
          <InputGroup>
            {showInput ? (
              <>
                <Input
                  ref={goalInputRef}
                  placeholder="New goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newGoal) {
                      handleAddGoal();
                      setShowInput(false); // Hide input after goal is added
                    }
                  }}
                />
                <InputRightElement>
                  <Icon
                    as={MdAddBox}
                    color={newGoal ? "purple.400" : "gray.400"}
                    fontSize={32}
                    cursor="pointer"
                    onClick={() => {
                      handleAddGoal();
                      setShowInput(false); // Hide input after goal is added
                    }}
                    opacity={newGoal ? 1 : 0.5}
                  />
                </InputRightElement>
              </>
            ) : (
              <Flex align="center">
                <Icon
                  as={MdAdd}
                  color="gray.400"
                  fontSize={26}
                  cursor="pointer"
                  onClick={() => {
                    setShowInput(true);
                    setTimeout(() => goalInputRef.current?.focus(), 0); // set focus when the state has been updated
                  }}
                />
                {goals.length === 0 && (
                  <Text
                    color="gray.400"
                    ml={1}
                    cursor="pointer"
                    onClick={() => {
                      setShowInput(true);
                      setTimeout(() => goalInputRef.current?.focus(), 0); // set focus when the state has been updated
                    }}
                  >
                    Add a new goal
                  </Text>
                )}
              </Flex>
            )}
          </InputGroup>
        </Grid>
      </Box>
    </Center>
  );
}

export default GoalView;
