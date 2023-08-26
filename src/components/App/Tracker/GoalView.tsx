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
  Badge,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Icon,
  Textarea,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  DrawerFooter,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { MdAdd } from "react-icons/md";
import { useGoals } from "@/hooks/useGoals";
import { Formik, Field, Form, FieldInputProps, ErrorMessage } from "formik";
import { CirclePicker } from "react-color";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { parseISO, startOfWeek as startOfWeekFns, format } from "date-fns";

type GoalViewProps = { user: User; startOfDay: string; startOfWeek: string };

function GoalView({ user, startOfDay, startOfWeek }: GoalViewProps) {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [mobileStartOfWeek, setMobileStartOfWeek] = useState(startOfWeek);
  const toast = useToast();

  useEffect(() => {
    if (!isLargerThan768) {
      const dateObj = parseISO(startOfDay); // Parse string to Date
      const startOfWeekDate = startOfWeekFns(dateObj); // Get the start of the week
      setMobileStartOfWeek(format(startOfWeekDate, "yyyy-MM-dd"));
    } else {
      setMobileStartOfWeek(startOfWeek);
    }
  }, [isLargerThan768, startOfDay, startOfWeek]);

  const {
    goals,
    handleAddGoal,
    handleCompleteGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  } = useGoals(user, isLargerThan768 ? startOfWeek : mobileStartOfWeek);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoalText, setSelectedGoalText] = useState("");
  const [selectedGoalCompleted, setSelectedGoalCompleted] = useState(false);
  const [selectedGoalDescription, setSelectedGoalDescription] = useState("");
  const [selectedGoalColor, setSelectedGoalColor] = useState("");

  const openDrawer = (
    id?: string,
    text?: string,
    completed?: boolean,
    description?: string,
    color?: string
  ) => {
    onOpen();
    setSelectedGoalId(id || null);
    setSelectedGoalText(text || "");
    setSelectedGoalCompleted(completed || false);
    setSelectedGoalDescription(description || "");
    setSelectedGoalColor(color || "");
  };

  const handleFormSubmit = (values: {
    goal: string;
    description: string;
    color: string;
  }) => {
    if (selectedGoalId) {
      handleUpdateGoal(
        selectedGoalId,
        values.goal,
        values.description,
        values.color
      );
    } else {
      handleAddGoal(values.goal, values.description, values.color);
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
              px={4}
              py={2}
              align="center"
              borderRadius="md"
              boxShadow="md"
              _hover={{ boxShadow: "0 0 0 2px purple.400" }}
              cursor="pointer"
              bg={goal.color}
              onClick={() =>
                openDrawer(
                  goal.id,
                  goal.text,
                  goal.completed,
                  goal.description,
                  goal.color
                )
              }
            >
              <Text fontSize="sm" fontWeight="semibold" flexGrow={1}>
                {goal.text}
              </Text>
              {goal.completed && (
                <Badge ml="1" h="5">
                  done
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
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {selectedGoalId ? "Edit Goal" : "Create New Goal"}
            </DrawerHeader>
            <DrawerBody>
              <Formik
                initialValues={{
                  goal: selectedGoalText,
                  description: selectedGoalDescription,
                  color: selectedGoalColor,
                }}
                onSubmit={handleFormSubmit}
                validate={(values) => {
                  const errors: any = {};
                  if (!values.goal.trim()) {
                    errors.goal = "Goal is required";
                  }
                  return errors;
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Field
                      name="goal"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <div>
                          <Input {...field} placeholder="New goal..." />
                          <ErrorMessage
                            name="goal"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      )}
                    />

                    <Field
                      name="description"
                      render={({ field }: { field: FieldInputProps<any> }) => (
                        <Textarea
                          {...field}
                          placeholder="Description..."
                          mt={4}
                          rows={15}
                        />
                      )}
                    />

                    <Field name="color">
                      {({
                        field,
                        form,
                      }: {
                        field: FieldInputProps<any>;
                        form: any;
                      }) => (
                        <Box mt={4}>
                          <Menu>
                            <MenuButton
                              as={Button}
                              rightIcon={<ChevronDownIcon />}
                              size="sm"
                              colorScheme="transparent"
                              variant="outline"
                              borderColor="gray.300"
                            >
                              <Box
                                w="20px"
                                h="20px"
                                borderRadius="4px"
                                bg={form.values.color || "#FFFFFF"}
                                mr="2"
                              />
                            </MenuButton>
                            <MenuList>
                              <MenuItem onSelect={() => {}}>
                                <CirclePicker
                                  color={form.values.color}
                                  onChangeComplete={(color) => {
                                    form.setFieldValue("color", color.hex);
                                    form.setFieldTouched("color", true);
                                  }}
                                  colors={[
                                    "#f0f8e6", // WHITE
                                    "#fbfbef", // Wheat
                                    "#f3f3f3", // MistyRose
                                    "#e0edf4", // LightGray
                                    "#e9e5f3", // LightCyan
                                    "#feeef5", // GhostWhite
                                    "#EA8C87", // Salmon
                                    "#FFB6C1", // LightPink
                                    "#FFA500", // Orange
                                    "#FFD700", // Gold
                                    "#f5f32e", // Champagne
                                    "#80ed99",
                                    "#D8BFD8", // Thistle
                                    "#B795EC", // MediumPurple
                                    "#6495ED", // CornflowerBlue
                                    "#87CEFA", // LightSkyBlue
                                    "#3CB371", // MediumSeaGreen
                                    "#2ec4b6", // Gold
                                  ]}
                                />
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Box>
                      )}
                    </Field>
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
                      </FormControl>
                    )}
                    <DrawerFooter>
                      <Button
                        mt={4}
                        colorScheme="blue"
                        isLoading={isSubmitting}
                        type="submit"
                      >
                        {selectedGoalId ? "Update" : "Create"}
                      </Button>
                      {selectedGoalId && (
                        <Button
                          mt={4}
                          ml={2}
                          variant="outline"
                          colorScheme="red"
                          onClick={() => handleDelete(selectedGoalId)}
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
    </Center>
  );
}

export default GoalView;
