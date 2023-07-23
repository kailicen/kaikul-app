import React, { useEffect, useState } from "react";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import { useStatistics } from "@/hooks/useStatistics";
import {
  Box,
  Text,
  List,
  ListItem,
  Center,
  VStack,
  Flex,
  Grid,
  Heading,
  GridItem,
  Tab,
  TabList,
  Tabs,
  Icon,
  ListIcon,
} from "@chakra-ui/react";
import "moment/locale/en-gb";
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from "recharts";
import LoadingScreen from "@/components/LoadingScreen";
import {
  MdLightbulb,
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
  MdClear,
} from "react-icons/md";
import FloatingFeedbackButton from "@/components/App/FloatingFeedbackButton";
import {
  add,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";

function Statistics() {
  const [loading, setLoading] = useState(false); // <-- Add this state

  const {
    user,
    tasks,
    blockers,
    goals,
    fetchTasks,
    fetchBlockers,
    fetchGoals,
    calculateCompletionRate,
  } = useStatistics();

  const [currentPeriod, setCurrentPeriod] = useState<Date>(new Date());

  const [isWeeklyView, setIsWeeklyView] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let startOfPeriod, endOfPeriod;

      if (isWeeklyView) {
        startOfPeriod = startOfWeek(currentPeriod, { weekStartsOn: 1 }); // Assuming week starts on Monday (1)
        endOfPeriod = endOfWeek(currentPeriod, { weekStartsOn: 1 }); // Assuming week ends on Sunday (0)
      } else {
        startOfPeriod = startOfMonth(currentPeriod);
        endOfPeriod = endOfMonth(currentPeriod);
      }

      await fetchTasks(startOfPeriod, endOfPeriod);
      await fetchBlockers(startOfPeriod, endOfPeriod);
      await fetchGoals(startOfPeriod, endOfPeriod);
      setLoading(false);
    };

    fetchData().catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, [currentPeriod, isWeeklyView]);

  const handlePrevious = (
    dateSetter: React.Dispatch<React.SetStateAction<Date>>,
    isWeeklyView: boolean
  ) => {
    dateSetter((prevDate) =>
      isWeeklyView ? sub(prevDate, { weeks: 1 }) : sub(prevDate, { months: 1 })
    );
  };

  const handleNext = (
    dateSetter: React.Dispatch<React.SetStateAction<Date>>,
    isWeeklyView: boolean
  ) => {
    dateSetter((prevDate) =>
      isWeeklyView ? add(prevDate, { weeks: 1 }) : add(prevDate, { months: 1 })
    );
  };

  const handlePreviousWeekly = () => {
    handlePrevious(setCurrentPeriod, true);
  };

  const handleNextWeekly = () => {
    handleNext(setCurrentPeriod, true);
  };

  const handlePreviousMonthly = () => {
    handlePrevious(setCurrentPeriod, false);
  };

  const handleNextMonthly = () => {
    handleNext(setCurrentPeriod, false);
  };

  const dateRange = {
    label: isWeeklyView ? "Week" : "Month",
    start: isWeeklyView
      ? startOfWeek(currentPeriod, { weekStartsOn: 1 }) // Assuming week starts on Monday (1)
      : startOfMonth(currentPeriod),
    end: isWeeklyView
      ? endOfWeek(currentPeriod, { weekStartsOn: 1 }) // Assuming week ends on Sunday (0)
      : endOfMonth(currentPeriod),
  };

  const taskCompletionRate = calculateCompletionRate(
    tasks,
    "tasks"
  ).completionRate;
  const completionRatePercentage = Math.round(taskCompletionRate * 100);
  const COLORS = ["#1dbd88", "#e4726c"];

  const completionCount = calculateCompletionRate(
    tasks,
    "tasks"
  ).completedCount;
  const totalTasks = tasks.length;

  const data = [
    { name: `Completed Tasks: ${completionCount}`, value: completionCount },
    {
      name: `Incomplete Tasks: ${totalTasks - completionCount}`,
      value: totalTasks - completionCount,
    },
  ];

  if (loading) {
    // Here, you can return a loader if the authentication state is still being determined.
    return <LoadingScreen />;
  }

  return (
    <>
      <AuthenticatedHeader user={user} />
      <Center>
        <Box p={5} pt="80px" w="1200px">
          {/* Here, pt (padding-top) is used to prevent overlap with the fixed header */}
          <VStack align="center" spacing={8}>
            <Tabs
              variant="soft-rounded"
              colorScheme="purple"
              defaultIndex={isWeeklyView ? 0 : 1}
              onChange={(index) => setIsWeeklyView(index === 0)}
            >
              <TabList mb="1em">
                <Tab>Weekly View</Tab>
                <Tab>Monthly View</Tab>
              </TabList>
            </Tabs>
            <Flex justify="space-between" align="center">
              <Box
                as="button"
                aria-label="Previous"
                onClick={
                  isWeeklyView ? handlePreviousWeekly : handlePreviousMonthly
                }
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                p={1}
                rounded="md"
                mr={2}
              >
                <Icon as={MdChevronLeft} fontSize="24px" color="gray.500" />
              </Box>
              <Text fontSize="xl" fontWeight="semibold">
                {isWeeklyView
                  ? `${dateRange.label}ly data: ${format(
                      dateRange.start,
                      "MMMM d"
                    )} - ${format(dateRange.end, "MMMM d")}`
                  : `${dateRange.label}ly data: ${format(
                      dateRange.start,
                      "MMMM"
                    )}`}
              </Text>
              <Box
                as="button"
                aria-label="Next Week"
                onClick={isWeeklyView ? handleNextWeekly : handleNextMonthly}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                p={1}
                rounded="md"
                ml={2}
              >
                <Icon as={MdChevronRight} fontSize="24px" color="gray.500" />
              </Box>
            </Flex>

            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
              }}
              gap={8}
            >
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <Box
                  p={6}
                  boxShadow="lg"
                  bg="white"
                  borderRadius="md"
                  textAlign="center"
                >
                  <Heading as="h2" size="md" mb={4}>
                    Task Completion Rate
                  </Heading>
                  <Center>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                        <Label
                          value={`${completionRatePercentage}%`}
                          position="center"
                          fontSize={26}
                        />
                      </Pie>
                      <Legend />
                    </PieChart>
                  </Center>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <Box p={6} boxShadow="lg" bg="white" borderRadius="md">
                  <Heading as="h2" size="md" mb={4}>
                    Goals
                  </Heading>
                  {goals.length > 0 ? (
                    <List>
                      {goals.map((goal) => (
                        <ListItem key={goal.id}>
                          {goal.completed === true ? (
                            <ListIcon as={MdCheckCircle} color="green.500" />
                          ) : (
                            <ListIcon as={MdClear} color="red.500" />
                          )}

                          {goal.text}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text>No goals this {dateRange.label}.</Text>
                  )}
                </Box>
                <Box mt={8} p={6} boxShadow="lg" bg="white" borderRadius="md">
                  <Heading as="h2" size="md" mb={4}>
                    Reflection
                  </Heading>
                  {blockers.length > 0 ? (
                    <List>
                      {blockers.map((blocker) => (
                        <ListItem key={blocker.id}>
                          <ListIcon as={MdLightbulb} color="orange.500" />
                          {blocker.text}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text>No reflection this {dateRange.label}.</Text>
                  )}
                </Box>
              </GridItem>
            </Grid>
          </VStack>
        </Box>
        <FloatingFeedbackButton /> {/* Add the feedback button */}
      </Center>
    </>
  );
}

export default Statistics;
