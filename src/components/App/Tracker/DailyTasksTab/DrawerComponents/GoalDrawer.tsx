import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spacer,
  Switch,
  useToast,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Icon,
} from "@chakra-ui/react";
import { DayPicker } from "react-day-picker";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CirclePicker } from "react-color";
import { Field, Form, Formik, FieldInputProps, ErrorMessage } from "formik";
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { format, isBefore } from "date-fns";

interface GoalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGoalId: string;
  selectedGoalText: string;
  selectedGoalDescription: string;
  selectedGoalColor: string;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleFormSubmit: (values: {
    goal: string;
    description: string;
    color: string;
    startDate: string;
    endDate: string;
  }) => void;
  startDisplayedMonth: Date;
  setStartDisplayedMonth: React.Dispatch<React.SetStateAction<Date>>;
  endDisplayedMonth: Date;
  setEndDisplayedMonth: React.Dispatch<React.SetStateAction<Date>>;
  selectedGoalCompleted: boolean;
  setSelectedGoalCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  handleCompleteGoal: (selectedGoalId: string) => void;
  handleDelete: (selectedGoalId: string) => void;
}

const GoalDrawer: React.FC<GoalDrawerProps> = ({
  isOpen,
  onClose,
  selectedGoalId,
  selectedGoalText,
  selectedGoalDescription,
  selectedGoalColor,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleFormSubmit,
  startDisplayedMonth,
  setStartDisplayedMonth,
  endDisplayedMonth,
  setEndDisplayedMonth,
  selectedGoalCompleted,
  setSelectedGoalCompleted,
  handleCompleteGoal,
  handleDelete,
}) => {
  const [isStartDatePopoverOpen, setStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setEndDatePopoverOpen] = useState(false);

  return (
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
                startDate: startDate,
                endDate: endDate || "", // or some default value
              }}
              onSubmit={handleFormSubmit}
              validate={(values) => {
                const errors: any = {};
                if (!values.goal.trim()) {
                  errors.goal = "Goal is required";
                }
                if (!values.endDate) {
                  errors.endDate = "End date is required";
                } else if (values.endDate <= values.startDate) {
                  errors.endDate = "End date should be after start date";
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
                        <Input
                          {...field}
                          placeholder="Enter your goal here (e.g., 'Become financially free in 5 years')"
                        />
                        <ErrorMessage
                          name="goal"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </div>
                    )}
                  />

                  <Field name="startDate">
                    {({
                      field,
                      form,
                    }: {
                      field: FieldInputProps<any>;
                      form: any;
                    }) => (
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
                                {field.value || "Select Start Date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverBody>
                                <DayPicker
                                  mode="single"
                                  weekStartsOn={1}
                                  month={startDisplayedMonth}
                                  onMonthChange={(month: Date) =>
                                    setStartDisplayedMonth(month)
                                  }
                                  selected={new Date(field.value)}
                                  onSelect={(selectedDay: Date | undefined) => {
                                    if (selectedDay) {
                                      const formattedDate = format(
                                        selectedDay,
                                        "yyyy-MM-dd"
                                      );
                                      setStartDate(formattedDate);
                                      form.setFieldValue(
                                        "startDate",
                                        formattedDate
                                      );
                                      setStartDatePopoverOpen(false);
                                    }
                                  }}
                                />
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                      </Box>
                    )}
                  </Field>

                  <Field name="endDate">
                    {({
                      field,
                      form,
                    }: {
                      field: FieldInputProps<any>;
                      form: any;
                    }) => (
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
                                {field.value || "Select End Date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverBody>
                                <DayPicker
                                  mode="single"
                                  weekStartsOn={1}
                                  month={endDisplayedMonth}
                                  onMonthChange={(month: Date) =>
                                    setEndDisplayedMonth(month)
                                  }
                                  disabled={(day: Date) =>
                                    isBefore(day, new Date(startDate))
                                  }
                                  selected={
                                    endDate ? new Date(field.value) : undefined
                                  }
                                  onSelect={(selectedDay: Date | undefined) => {
                                    if (selectedDay) {
                                      const formattedDate = format(
                                        selectedDay,
                                        "yyyy-MM-dd"
                                      );
                                      setEndDate(formattedDate);
                                      form.setFieldValue(
                                        "endDate",
                                        formattedDate
                                      );
                                      setEndDatePopoverOpen(false);
                                    }
                                  }}
                                />
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                          <ErrorMessage
                            name="endDate"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </FormControl>
                      </Box>
                    )}
                  </Field>

                  <Field
                    name="description"
                    render={({ field }: { field: FieldInputProps<any> }) => (
                      <Textarea
                        {...field}
                        placeholder="Break your goal down to actionable steps. Too hard? Think of obstacles you might face and what are the solutions."
                        mt={4}
                        rows={10}
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
                        <FormControl display="flex" alignItems="center" mt={4}>
                          <FormLabel mb="0">Choose a color:</FormLabel>
                          <Menu>
                            <MenuButton
                              as={Button}
                              rightIcon={<ChevronDownIcon />}
                              variant="outline"
                              borderColor="gray.300"
                            >
                              <Box
                                w="20px"
                                h="20px"
                                borderRadius="4px"
                                bg={form.values.color || "#ffffff"}
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
                        </FormControl>
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
                    <Button mt={4} isLoading={isSubmitting} type="submit">
                      {selectedGoalId ? "Update" : "Create"}
                    </Button>
                    {selectedGoalId && (
                      <Button
                        mt={4}
                        ml={2}
                        variant="outline"
                        _hover={{ bgColor: "red.500", color: "white" }}
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
  );
};

export default GoalDrawer;
