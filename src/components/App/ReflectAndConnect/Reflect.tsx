import LoadingScreen from "@/components/LoadingScreen";
import { auth } from "@/firebase/clientApp";
import { useTeamTab } from "@/hooks/useTeamTab";
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
} from "@chakra-ui/react";
import {
  endOfWeek,
  startOfWeek as startOfWeekDateFns,
  format,
  parseISO,
  addDays,
} from "date-fns";
import { User } from "firebase/auth";
import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type Props = {};

function Reflect({}: Props) {
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

  const currentDate = new Date();
  // Format the start and end of week for the button display
  const startOfWeekDate = startOfWeekDateFns(currentDate, { weekStartsOn: 1 }); // Monday
  const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday
  const formattedStartOfWeek = format(startOfWeekDate, "MMMM do");
  const formattedEndOfWeek = format(endOfWeekDate, "MMMM do, yyyy");

  const [startOfWeek, setStartOfWeek] = useState(
    format(startOfWeekDateFns(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );

  const {
    teamTabs,
    handleUpdateTeamTab,
    handleAddTeamTab,
    isCurrentWeekDataExist,
  } = useTeamTab(user as User, startOfWeek);

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
    <>
      <Heading size="md" mb={3}>
        Weekly Updates
      </Heading>
      <Text mb={3}>
        Track your week&apos;s highlights effortlessly! Fill out your weekly
        updates, a fun, vital part of our sessions.
      </Text>
      {!isCurrentWeekDataExist && (
        <Button onClick={() => openDrawer()}>
          Add Update for {formattedStartOfWeek} - {formattedEndOfWeek}
        </Button>
      )}
      {teamTabs.map((teamTab) => {
        const startOfWeekDate = parseISO(teamTab.startOfWeek);
        const formattedStartOfWeek = format(startOfWeekDate, "MMM do");

        const endOfWeekDate = addDays(startOfWeekDate, 6);
        const formattedEndOfWeek = format(endOfWeekDate, "MMM do, yyyy");

        return (
          <Box
            key={teamTab.id}
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
            mt={5}
            p={5}
            shadow="md"
            borderWidth="1px"
            flex="1"
            borderRadius="md"
            cursor="pointer"
          >
            <Heading fontSize="lg">
              {formattedStartOfWeek} - {formattedEndOfWeek}
            </Heading>
            <Box display="flex" alignItems="center" mt={4} gap={2}>
              <Text fontWeight="semibold">⭐ Week Rating:</Text>
              <Text> {teamTab.rateWeek}/10</Text>
            </Box>
            <Box display="flex" alignItems="center" mt={4} gap={2}>
              <Text fontWeight="semibold">😀 Happiness Rating:</Text>
              <Text> {teamTab.rateHappiness}/10</Text>
            </Box>
            <Box display="flex" alignItems="center" mt={4} gap={2}>
              <Text fontWeight="semibold">⏰ Practice Hours:</Text>
              <Text> {teamTab.practiceHours}</Text>
            </Box>
            <Box display="flex" flexDirection="column" gap={1} mt={4}>
              <Text fontWeight="semibold">😆 Biggest improvement:</Text>
              <Text> {teamTab.biggestImprovement}</Text>
            </Box>
            <Box display="flex" flexDirection="column" gap={1} mt={4}>
              <Text fontWeight="semibold">🫠 Biggest obstacle:</Text>
              <Text> {teamTab.biggestObstacle}</Text>
            </Box>
            <Box display="flex" flexDirection="column" gap={1} mt={4}>
              <Text fontWeight="semibold">🧑‍🎓 Lesson Learned:</Text>
              <Text> {teamTab.lessonLearned}</Text>
            </Box>
          </Box>
        );
      })}

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
                        <FormLabel>⭐ Rate Your Week (10/10)</FormLabel>
                        <Field
                          name="rateWeek"
                          type="number"
                          max={10}
                          min={0}
                          as={Input}
                        />
                      </FormControl>
                      <FormControl id="rateHappiness">
                        <FormLabel>😀 Rate Your Happiness (10/10)</FormLabel>
                        <Field
                          name="rateHappiness"
                          type="number"
                          max={10}
                          min={0}
                          as={Input}
                        />
                      </FormControl>
                      <FormControl id="practiceHours">
                        <FormLabel>
                          ⏰ Deliberate practice hours count
                        </FormLabel>
                        <Field
                          name="practiceHours"
                          type="number"
                          min={0}
                          placeholder="How many hours of focused, distraction-free work have you done?"
                          as={Input}
                        />
                      </FormControl>
                      <FormControl id="biggestImprovement">
                        <FormLabel>😆 Biggest improvement</FormLabel>
                        <Field
                          name="biggestImprovement"
                          placeholder="Describe your biggest improvement of the week"
                          as={Textarea}
                        />
                      </FormControl>
                      <FormControl id="biggestObstacle">
                        <FormLabel>🫠 Biggest obstacle</FormLabel>
                        <Field
                          name="biggestObstacle"
                          placeholder="Describe your biggest obstacle of the week"
                          as={Textarea}
                        />
                      </FormControl>
                      <FormControl id="lessonLearned">
                        <FormLabel>🧑‍🎓 Lesson Learned</FormLabel>
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
    </>
  );
}

export default Reflect;
