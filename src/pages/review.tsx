import React, { useState } from "react";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import {
  Box,
  Text,
  Center,
  VStack,
  Grid,
  Heading,
  Tab,
  TabList,
  Tabs,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Link,
} from "@chakra-ui/react";
import "moment/locale/en-gb";
import moment from "moment";
import LoadingScreen from "@/components/LoadingScreen";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import {
  endOfWeek,
  startOfWeek as startOfWeekDateFns,
  format,
  isBefore,
  isEqual,
  parseISO,
  addDays,
} from "date-fns";
import { Formik, Form, Field } from "formik";
import { useTeamTab } from "@/hooks/useTeamTab";
import Connect from "@/components/App/Connect/Connect";
import FloatingFeedbackButton from "@/components/App/FloatingFeedbackButton";

moment.locale("en-gb");

function Review() {
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
    moment().startOf("week").format("YYYY-MM-DD")
  );

  const [activeTab, setActiveTab] = useState<"me" | "team">("me");
  const handleTabChange = (index: any) => {
    if (index === 0) {
      setActiveTab("me");
    } else if (index === 1) {
      setActiveTab("team");
    }
  };

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
      <AuthenticatedHeader user={user} />
      <Box p={5} pt="80px">
        <Center>
          <Tabs
            variant="soft-rounded"
            colorScheme="purple"
            defaultIndex={activeTab === "me" ? 0 : 1}
            onChange={handleTabChange}
          >
            <TabList mb="1em">
              <Tab>Reflect</Tab>
              <Tab>Connect</Tab>
            </TabList>
          </Tabs>
        </Center>
        <Center>
          {activeTab === "me" ? (
            <Grid
              templateColumns={{ base: "1fr", md: "2fr 1fr" }}
              gap={10}
              w="1200px"
            >
              <Box order={{ base: 2, md: 1 }}>
                <Heading size="md" mb={3}>
                  Weekly Updates
                </Heading>
                <Text mb={3}>
                  Track your week&apos;s highlights effortlessly! Fill out your
                  weekly updates, a fun, vital part of our sessions.
                </Text>
                {!isCurrentWeekDataExist && (
                  <Button onClick={() => openDrawer()}>
                    Add Update for {formattedStartOfWeek} - {formattedEndOfWeek}
                  </Button>
                )}
                {teamTabs.map((teamTab) => {
                  const startOfWeekDate = parseISO(teamTab.startOfWeek);
                  const formattedStartOfWeek = format(
                    startOfWeekDate,
                    "MMM do"
                  );

                  const endOfWeekDate = addDays(startOfWeekDate, 6);
                  const formattedEndOfWeek = format(
                    endOfWeekDate,
                    "MMM do, yyyy"
                  );

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
                        <Text fontWeight="semibold">
                          😆 Biggest improvement:
                        </Text>
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

                <Drawer
                  isOpen={isOpen}
                  placement="right"
                  onClose={onClose}
                  size="lg"
                >
                  <DrawerOverlay>
                    <DrawerContent>
                      <DrawerCloseButton />
                      <DrawerHeader>
                        {selectedUpdateId
                          ? "Edit Weekly Update"
                          : "Add Weekly Update"}
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
                                  <FormLabel>
                                    ⭐ Rate Your Week (10/10)
                                  </FormLabel>
                                  <Field
                                    name="rateWeek"
                                    type="number"
                                    max={10}
                                    min={0}
                                    as={Input}
                                  />
                                </FormControl>
                                <FormControl id="rateHappiness">
                                  <FormLabel>
                                    😀 Rate Your Happiness (10/10)
                                  </FormLabel>
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
                                <Button
                                  variant="outline"
                                  mr={3}
                                  onClick={onClose}
                                >
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
              </Box>

              <Box order={{ base: 1, md: 2 }} p={2}>
                <Heading size="md" mb={3}>
                  Team Accountability
                </Heading>
                <Accordion allowMultiple>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          Slack Community
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      Join our{" "}
                      <Link
                        color="purple.500"
                        fontWeight="bold"
                        href="https://join.slack.com/t/kaikul/shared_invite/zt-1xx8xt5mr-0xZAruch9xbXPLxRsK59Tw"
                        isExternal
                      >
                        Slack community
                      </Link>{" "}
                      for the latest product updates, developmental resources,
                      and daily task reports.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          Weekly Sessions
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      Participate in our{" "}
                      <Link
                        color="purple.500"
                        fontWeight="bold"
                        href="https://kaikul.eventbrite.com"
                        isExternal
                      >
                        weekly sessions
                      </Link>{" "}
                      and engage with KaiKul buddies.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          Session Agenda
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      Check the{" "}
                      <Link
                        color="purple.500"
                        fontWeight="bold"
                        href="https://www.canva.com/design/DAFjK3uvKW4/sNhHTl74eTJQZAh5DpjfIw/view"
                        isExternal
                      >
                        session agenda
                      </Link>{" "}
                      for more information.
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Grid>
          ) : (
            <Connect />
          )}
          <FloatingFeedbackButton /> {/* Add the feedback button */}
        </Center>
      </Box>
    </>
  );
}

export default Review;
