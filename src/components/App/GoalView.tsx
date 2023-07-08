import React, { useState, useEffect } from "react";
import {
  Text,
  Box,
  Center,
  Flex,
  Grid,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  Spacer,
  IconButton,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { MdAdd, MdDelete } from "react-icons/md";
import { useGoals } from "@/hooks/useGoals";
import moment from "moment";
import { Formik, Field, Form, FieldInputProps } from "formik";

type GoalViewProps = { user: User; startOfDay: string; startOfWeek: string };

function GoalView({ user, startOfDay, startOfWeek }: GoalViewProps) {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [mobileStartOfWeek, setMobileStartOfWeek] = useState(startOfWeek);
  const toast = useToast();

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoalText, setSelectedGoalText] = useState("");
  const [selectedGoalCompleted, setSelectedGoalCompleted] = useState(false);

  const openDrawer = (id?: string, text?: string, completed?: boolean) => {
    onOpen();
    setSelectedGoalId(id || null);
    setSelectedGoalText(text || "");
    setSelectedGoalCompleted(completed || false);
  };

  const handleFormSubmit = (values: { goal: string }) => {
    setNewGoal(values.goal); // set new goal value
    if (selectedGoalId) {
      handleUpdateGoal(selectedGoalId, values.goal);
    } else {
      handleAddGoal();
    }
    onClose();
    setSelectedGoalId(null);
    setSelectedGoalText("");
  };

  const handleDelete = (id: string) => {
    handleDeleteGoal(id);
    toast({
      title: "Goal deleted.",
      description: "Your goal has been deleted successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Center>
      <Box width="100%" p={4}>
        <Text mb={2} fontWeight="semibold">
          Sprint Goals:{" "}
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={3}>
          {goals.map((goal) => (
            <Flex
              key={goal.id}
              px={3}
              py={1}
              shadow="sm"
              borderWidth="1px"
              borderRadius="md"
              _hover={{ shadow: "md" }}
              onClick={() => openDrawer(goal.id, goal.text, goal.completed)}
            >
              <Text fontSize="sm" flexGrow={1}>
                {goal.text}
              </Text>
              {goal.completed && (
                <Badge colorScheme="green" ml="1">
                  Completed
                </Badge>
              )}
            </Flex>
          ))}
          <Flex align="center">
            <Icon
              as={MdAdd}
              color="gray.400"
              fontSize={26}
              cursor="pointer"
              onClick={() => openDrawer()}
            />
          </Flex>
        </Grid>
      </Box>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {selectedGoalId ? "Edit Goal" : "Create New Goal"}
            </DrawerHeader>
            <DrawerBody>
              <Formik
                initialValues={{ goal: selectedGoalText }}
                onSubmit={handleFormSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Field
                      name="goal"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <Input {...field} placeholder="New goal..." />
                      )}
                    />
                    {selectedGoalId && (
                      <FormControl display="flex" alignItems="center" mt={4}>
                        <FormLabel mb="0">Completed:</FormLabel>
                        <Switch
                          isChecked={selectedGoalCompleted}
                          onChange={() => {
                            handleCompleteGoal(selectedGoalId);
                            setSelectedGoalCompleted(!selectedGoalCompleted);
                          }}
                        />
                        <Spacer />
                        <IconButton
                          aria-label="Delete"
                          icon={<MdDelete />}
                          colorScheme="red"
                          onClick={() => handleDelete(selectedGoalId)}
                        />
                      </FormControl>
                    )}
                    <Button
                      mt={4}
                      colorScheme="blue"
                      isLoading={isSubmitting}
                      type="submit"
                    >
                      {selectedGoalId ? "Update" : "Create"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Center>
  );
}

export default GoalView;
