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
import moment, { Moment } from "moment";
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from "recharts";
import LoadingScreen from "@/components/LoadingScreen";
import {
  MdLightbulb,
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

moment.locale("en-gb");

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

  const [currentPeriod, setCurrentPeriod] = useState<Moment>(moment());
  const [isWeeklyView, setIsWeeklyView] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let startOfPeriod, endOfPeriod;

      if (isWeeklyView) {
        startOfPeriod = currentPeriod.clone().startOf("week").toDate();
        endOfPeriod = currentPeriod.clone().endOf("week").toDate();
      } else {
        startOfPeriod = currentPeriod.clone().startOf("month").toDate();
        endOfPeriod = currentPeriod.clone().endOf("month").toDate();
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
    dateSetter: React.Dispatch<React.SetStateAction<Moment>>
  ) => {
    dateSetter((prevDate) =>
      prevDate
        .clone()
        .subtract(isWeeklyView ? 1 : 1, isWeeklyView ? "week" : "month")
    );
  };

  const handleNext = (
    dateSetter: React.Dispatch<React.SetStateAction<Moment>>
  ) => {
    dateSetter((prevDate) =>
      prevDate
        .clone()
        .add(isWeeklyView ? 1 : 1, isWeeklyView ? "week" : "month")
    );
  };

  const dateRange = {
    label: isWeeklyView ? "Week" : "Month",
    start: currentPeriod.clone().startOf(isWeeklyView ? "week" : "month"),
    end: currentPeriod.clone().endOf(isWeeklyView ? "week" : "month"),
  };

  const taskCompletionRate = calculateCompletionRate(tasks, "tasks");
  const completionRatePercentage = Math.round(taskCompletionRate * 100);

  const data = [
    { name: "Completed Tasks", value: completionRatePercentage },
    { name: "Incomplete Tasks", value: 100 - completionRatePercentage },
  ];

  const COLORS = ["#1dbd88", "#e4726c"];
  const totalTasks = tasks.length;

  if (loading) {
    // Here, you can return a loader if the authentication state is still being determined.
    return <LoadingScreen />;
  }

  return (
    <>
      <AuthenticatedHeader user={user} />
      <Center>
        <Box p={5} pt="100px" w="1000px">
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
                onClick={() => handlePrevious(setCurrentPeriod)}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                p={1}
                rounded="md"
                mr={2}
              >
                <Icon as={MdChevronLeft} fontSize="24px" color="gray.500" />
              </Box>
              {isWeeklyView ? (
                <Text fontSize="xl" fontWeight="semibold">
                  {dateRange.label}ly data: {dateRange.start?.format("MMMM D")}{" "}
                  - {dateRange.end?.format("MMMM D")}
                </Text>
              ) : (
                <Text fontSize="xl" fontWeight="semibold">
                  {dateRange.label}ly data: {dateRange.start.format("MMMM")}
                </Text>
              )}
              <Box
                as="button"
                aria-label="Next Week"
                onClick={() => handleNext(setCurrentPeriod)}
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
                          value={`Completion Rate: ${completionRatePercentage}%`}
                          position="center"
                        />
                      </Pie>
                      <Tooltip />
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
                          <ListIcon as={MdCheckCircle} color="green.500" />
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
      </Center>
    </>
  );
}

export default Statistics;
