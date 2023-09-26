import LoadingScreen from "@/components/LoadingScreen";
import { auth } from "@/firebase/clientApp";
import { useWeeklyReflections } from "@/hooks/useWeeklyReflections";
import {
  Box,
  Text,
  Heading,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  DrawerFooter,
  useDisclosure,
  Input,
  Select,
  Flex,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  endOfWeek,
  startOfWeek as startOfWeekDateFns,
  format,
  parseISO,
} from "date-fns";
import { User } from "firebase/auth";
import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { WeeklyReflectionCard } from "./WeeklyReflectionCard";
import { utcToZonedTime } from "date-fns-tz";

type Props = {};

function WeeklyUpdateSection({}: Props) {
  const [user, loading] = useAuthState(auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);
  const [selectedRateWeek, setSelectedRateWeek] = useState<number | null>(null);
  const [selectedRateHappiness, setSelectedRateHappiness] = useState<
    number | null
  >(null);
  const [selectedPracticeHours, setSelectedPracticeHours] = useState<
    number | null
  >(null);
  const [selectedBiggestImprovement, setSelectedBiggestImprovement] =
    useState("");
  const [selectedBiggestObstacle, setSelectedBiggestObstacle] = useState("");
  const [selectedLessonLearned, setSelectedLessonLearned] = useState("");

  // Format the start and end of week for the button display
  // Get user's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert the current date to user's timezone
  const currentDateInUserTz = utcToZonedTime(new Date(), userTimeZone);

  // Adjust your existing date manipulations
  const startOfWeekDate = startOfWeekDateFns(currentDateInUserTz, {
    weekStartsOn: 1,
  });
  const endOfWeekDate = endOfWeek(currentDateInUserTz, { weekStartsOn: 1 });
  const formattedStartOfWeek = format(
    utcToZonedTime(startOfWeekDate, userTimeZone),
    "MMM do"
  );
  const formattedEndOfWeek = format(
    utcToZonedTime(endOfWeekDate, userTimeZone),
    "MMM do, yyyy"
  );

  const [startOfWeek, setStartOfWeek] = useState(
    format(
      utcToZonedTime(
        startOfWeekDateFns(new Date(), { weekStartsOn: 1 }),
        userTimeZone
      ),
      "yyyy-MM-dd"
    )
  );

  const {
    teamTabs,
    handleUpdateTeamTab,
    handleAddTeamTab,
    isCurrentWeekDataExist,
    handleNextPage,
    handlePrevPage,
    currentPage,
    selectedDate,
    setSelectedDate,
    dataForSelectedDate,
    setDataForSelectedDate,
    uniqueDates,
  } = useWeeklyReflections(user as User, startOfWeek);

  // Use the list to populate the options in your Select dropdown.
  const weeklyOptions = uniqueDates.map((date) => {
    const startOfWeekDateUTC = parseISO(date);
    const startOfWeekDate = utcToZonedTime(startOfWeekDateUTC, userTimeZone);
    const formattedStartOfWeek = format(startOfWeekDate, "MMM do");

    const endOfWeekDateUTC = endOfWeek(startOfWeekDateUTC);
    const endOfWeekDate = utcToZonedTime(endOfWeekDateUTC, userTimeZone);
    const formattedEndOfWeek = format(endOfWeekDate, "MMM do, yyyy");

    return {
      label: `${formattedStartOfWeek} - ${formattedEndOfWeek}`,
      value: date,
    };
  });

  if (loading) {
    // Here, you can return a loader if the authentication state is still being determined.
    return <LoadingScreen />;
  }

  const openDrawer = (
    id?: string,
    rateWeek?: number,
    rateHappiness?: number,
    practiceHours?: number,
    biggestImprovement?: string,
    biggestObstacle?: string,
    lessonLearned?: string
  ) => {
    onOpen();
    setSelectedUpdateId(id || null);
    setSelectedRateWeek(rateWeek || null);
    setSelectedRateHappiness(rateHappiness || null);
    setSelectedPracticeHours(practiceHours || null);
    setSelectedBiggestImprovement(biggestImprovement || "");
    setSelectedBiggestObstacle(biggestObstacle || "");
    setSelectedLessonLearned(lessonLearned || "");
  };

  const handleDateChange = (value: string) => {
    if (value === "clear") {
      setSelectedDate(null);
      setDataForSelectedDate(null);
    } else {
      setSelectedDate(value);
    }
  };

  const handleFormSubmit = async (values: {
    rateWeek: number;
    rateHappiness: number;
    practiceHours: number;
    biggestImprovement: string;
    biggestObstacle: string;
    lessonLearned: string;
  }) => {
    if (selectedUpdateId) {
      // handleUpdate
      handleUpdateTeamTab(
        selectedUpdateId,
        values.rateWeek,
        values.rateHappiness,
        values.practiceHours,
        values.biggestImprovement,
        values.biggestObstacle,
        values.lessonLearned
      );
    } else {
      // handleAdd
      handleAddTeamTab(
        startOfWeek,
        values.rateWeek,
        values.rateHappiness,
        values.practiceHours,
        values.biggestImprovement,
        values.biggestObstacle,
        values.lessonLearned
      );
    }
    onClose();
    setSelectedUpdateId(null);
  };
  return (
    <VStack gap={4} align="start" w="100%">
      <Text mb={3}>
        Track your week&apos;s highlights effortlessly! Fill out your weekly
        updates, a fun, vital part of our sessions.
      </Text>
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        gap={2}
        w="100%"
      >
        {!isCurrentWeekDataExist && (
          <Button onClick={() => openDrawer()} whiteSpace="nowrap">
            Add Update for {formattedStartOfWeek} - {formattedEndOfWeek}
          </Button>
        )}
        <Select
          placeholder="Search an Update"
          borderRadius="full"
          width="auto"
          value={selectedDate || ""}
          onChange={(e) => handleDateChange(e.target.value)}
        >
          <option value="clear">Clear Filter</option>
          {weeklyOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Flex>
      {dataForSelectedDate ? (
        <WeeklyReflectionCard
          record={dataForSelectedDate}
          onClick={() =>
            openDrawer(
              dataForSelectedDate.id,
              dataForSelectedDate.rateWeek,
              dataForSelectedDate.rateHappiness,
              dataForSelectedDate.practiceHours,
              dataForSelectedDate.biggestImprovement,
              dataForSelectedDate.biggestObstacle,
              dataForSelectedDate.lessonLearned
            )
          }
        />
      ) : teamTabs.length > 0 ? (
        teamTabs.map((teamTab) => (
          <WeeklyReflectionCard
            key={teamTab.id}
            record={teamTab}
            onClick={() =>
              openDrawer(
                teamTab.id,
                teamTab.rateWeek,
                teamTab.rateHappiness,
                teamTab.practiceHours,
                teamTab.biggestImprovement,
                teamTab.biggestObstacle,
                teamTab.lessonLearned
              )
            }
          />
        ))
      ) : (
        <Alert status="info">
          <AlertIcon />
          No weekly reflections have been added yet. Start by adding some!
        </Alert>
      )}

      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        gap={2}
        mt={5}
      >
        <Button onClick={handlePrevPage}>Prev</Button>
        <Text>Page: {currentPage}</Text> {/* Display the current page here */}
        <Button onClick={handleNextPage}>Next</Button>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {selectedUpdateId ? "Edit Weekly Update" : "Add Weekly Update"}
            </DrawerHeader>

            <DrawerBody>
              <Formik
                initialValues={{
                  rateWeek: selectedRateWeek as number,
                  rateHappiness: selectedRateHappiness as number,
                  practiceHours: selectedPracticeHours as number,
                  biggestImprovement: selectedBiggestImprovement,
                  biggestObstacle: selectedBiggestObstacle,
                  lessonLearned: selectedLessonLearned,
                }}
                onSubmit={handleFormSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <VStack spacing={4}>
                      <FormControl id="rateWeek">
                        <FormLabel>Rate Your Week (10/10)</FormLabel>
                        <Field
                          name="rateWeek"
                          type="number"
                          max={10}
                          min={0}
                          as={Input}
                        />
                      </FormControl>
                      <FormControl id="rateHappiness">
                        <FormLabel>Rate Your Happiness (10/10)</FormLabel>
                        <Field
                          name="rateHappiness"
                          type="number"
                          max={10}
                          min={0}
                          as={Input}
                        />
                      </FormControl>
                      <FormControl id="practiceHours">
                        <FormLabel>Deliberate practice hours count</FormLabel>
                        <Field
                          name="practiceHours"
                          type="number"
                          min={0}
                          placeholder="How many hours of focused, distraction-free work have you done?"
                          as={Input}
                        />
                      </FormControl>
                      <FormControl id="biggestImprovement">
                        <FormLabel>Biggest improvement</FormLabel>
                        <Field
                          name="biggestImprovement"
                          placeholder="Describe your biggest improvement of the week"
                          as={Textarea}
                        />
                      </FormControl>
                      <FormControl id="biggestObstacle">
                        <FormLabel>Biggest obstacle</FormLabel>
                        <Field
                          name="biggestObstacle"
                          placeholder="Describe your biggest obstacle of the week"
                          as={Textarea}
                        />
                      </FormControl>
                      <FormControl id="lessonLearned">
                        <FormLabel>Lesson Learned</FormLabel>
                        <Field
                          name="lessonLearned"
                          placeholder="What's the greatest lesson you learned this week?"
                          as={Textarea}
                        />
                      </FormControl>
                    </VStack>

                    <DrawerFooter>
                      <Button variant="outline" mr={3} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button type="submit" isLoading={isSubmitting}>
                        Save
                      </Button>
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
}

export default WeeklyUpdateSection;
