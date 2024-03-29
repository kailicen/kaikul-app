import { Goal } from "@/atoms/goalsAtom";
import { Task } from "@/atoms/tasksAtom";
import { useStatistics } from "@/hooks/useStatistics";
import {
  VStack,
  ButtonGroup,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useMediaQuery,
  useColorMode,
} from "@chakra-ui/react";
import {
  eachDayOfInterval,
  format,
  getISOWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

type TimeRange = "day" | "week" | "month" | "6months" | "year";
type ChartData = {
  name: string;
  Total: number;
  Completed: number;
};

// Helper function to convert date string to local Date object
const toDateObj = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-");
  return new Date(+year, +month - 1, +day);
};

const groupData = (
  data: Task[],
  timeRange: TimeRange,
  start: Date,
  end: Date
): Record<string, Task[]> => {
  let groupedData: Record<string, Task[]> = {};

  // Get an array of all dates in the range
  const allDates = eachDayOfInterval({ start, end });

  // Initialize groupedData with all dates in the range, each having an empty array
  allDates.forEach((date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    groupedData[formattedDate] = [];
  });

  switch (timeRange) {
    case "day":
    case "week":
    case "month":
      groupedData = data.reduce<Record<string, Task[]>>((acc, task) => {
        const date = format(toDateObj(task.date), "yyyy-MM-dd");
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);
        return acc;
      }, groupedData);
      break;
    case "6months":
      groupedData = data.reduce<Record<string, Task[]>>((acc, task) => {
        const weekStart = format(
          startOfWeek(toDateObj(task.date)),
          "yyyy-MM-dd"
        );
        if (!acc[weekStart]) acc[weekStart] = [];
        acc[weekStart].push(task);
        return acc;
      }, {});
      break;
    case "year":
      groupedData = data.reduce<Record<string, Task[]>>((acc, task) => {
        const monthStart = format(
          startOfMonth(toDateObj(task.date)),
          "yyyy-MM"
        );
        if (!acc[monthStart]) acc[monthStart] = [];
        acc[monthStart].push(task);
        return acc;
      }, {});
      break;
    default:
      groupedData = {};
  }

  return groupedData;
};

const formatDateLabel = (date: Date, timeRange: TimeRange): string => {
  //console.log("Raw Date:", date);

  switch (timeRange) {
    case "day":
      return format(date, "eee d"); // E.g., "Mon"
    case "week":
      return format(date, "eee"); // E.g., "Mon"
    case "month":
      return format(date, "d"); // E.g., "1"
    case "6months":
      const firstDayOfMonth = startOfMonth(date);
      const firstWeekOfMonth = getISOWeek(firstDayOfMonth);
      const currentWeekOfYear = getISOWeek(date);
      const weekOfMonth = currentWeekOfYear - firstWeekOfMonth + 1;
      return `${format(date, "MMM")} W${weekOfMonth}`;
    case "year":
      return format(date, "MMM yyyy"); // E.g., "Jan 2023"
    default:
      return format(date, "MM/dd/yyyy"); // Default format
  }
};

const MyStatsCard: React.FC = () => {
  const { fetchTasks, fetchGoals, calculateCompletionRate } = useStatistics();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [taskData, setTaskData] = useState<Record<string, Task[]>>({});
  const [goalData, setGoalData] = useState<Goal[]>([]);

  const { colorMode } = useColorMode();

  const [filter, setFilter] = useState("all"); // filter state to toggle between all and completed
  const [chartData, setChartData] = useState<ChartData[]>([]); // State to hold your chart data

  const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");

  useEffect(() => {
    let start: Date;

    let end: Date = new Date(); // Setting end to the date and time in user's timezone

    switch (timeRange) {
      case "day":
        start = startOfDay(end);
        break;

      case "week":
        start = subDays(end, 6); // Go back 7 days from now
        //console.log("Start Date:", start);
        //console.log("End Date:", end);
        break;

      case "month":
        start = subMonths(end, 1); // Go back 1 month from now
        break;

      case "6months":
        start = subMonths(end, 6); // Go back 6 months from now
        break;

      case "year":
        start = subMonths(end, 12); // Go back 12 months from now
        break;

      default:
        start = new Date(end);
    }

    const fetchStatistics = async () => {
      const tasks = await fetchTasks(start, end);
      //console.log("Fetched tasks:", tasks);
      const goals = await fetchGoals(start, end);

      setTaskData(groupData(tasks, timeRange, start, end));
      //console.log("Grouped Tasks:", taskData);
      setGoalData(goals);
    };

    fetchStatistics();
  }, [timeRange, fetchTasks, fetchGoals]);

  const allTasks = Object.values(taskData).flat();

  const taskStats = calculateCompletionRate(allTasks, "tasks");
  const goalStats = calculateCompletionRate(goalData, "goals");

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((task) => task.completed).length;

  const totalGoals = goalData.length;
  const completedGoals = goalData.filter((goal) => goal.completed).length;

  useEffect(() => {
    const newChartData = Object.entries(taskData).map(([date, tasks]) => {
      //console.log("Current Date:", date);
      const name = formatDateLabel(toDateObj(date), timeRange);
      //console.log("Formatted Name:", name);
      const totalTasksForDate = tasks.length;
      const completedTasksForDate = tasks.filter(
        (task) => task.completed
      ).length;
      return {
        name,
        Total: totalTasksForDate,
        Completed: completedTasksForDate,
      };
    });

    if (filter === "completed") {
      newChartData.forEach((data) => {
        data.Total = data.Completed;
      });
    }

    setChartData(newChartData);
    //console.log("Chart Data:", newChartData);
  }, [taskData, filter, timeRange]);

  return (
    <VStack
      gap={{ base: 2, md: 4 }}
      p={{ base: 2, md: 4 }}
      border="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      bg={colorMode === "light" ? "white" : "gray.800"}
      borderRadius="md"
      boxShadow="lg"
      w="100%"
    >
      <Text fontSize="lg" fontWeight="semibold">
        My Stats
      </Text>
      <ButtonGroup isAttached variant="outline">
        <Button
          onClick={() => setTimeRange("day")}
          bg={timeRange === "day" ? "#4130AC" : undefined}
          color={timeRange === "day" ? "white" : undefined}
        >
          D
        </Button>
        <Button
          onClick={() => setTimeRange("week")}
          bg={timeRange === "week" ? "#4130AC" : undefined}
          color={timeRange === "week" ? "white" : undefined}
        >
          W
        </Button>
        <Button
          onClick={() => setTimeRange("month")}
          bg={timeRange === "month" ? "#4130AC" : undefined}
          color={timeRange === "month" ? "white" : undefined}
        >
          M
        </Button>
        <Button
          onClick={() => setTimeRange("6months")}
          bg={timeRange === "6months" ? "#4130AC" : undefined}
          color={timeRange === "6months" ? "white" : undefined}
        >
          6M
        </Button>
        <Button
          onClick={() => setTimeRange("year")}
          bg={timeRange === "year" ? "#4130AC" : undefined}
          color={timeRange === "year" ? "white" : undefined}
        >
          Y
        </Button>
      </ButtonGroup>

      {/* Bar Chart to display the total and completed tasks */}
      <ResponsiveContainer
        width={isLargerThanMD ? "100%" : "99%"}
        height={isLargerThanMD ? 300 : 250}
      >
        <BarChart
          width={isLargerThanMD ? 500 : 300}
          height={300}
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Total" fill="#8884d8" />
          <Bar dataKey="Completed" fill="#ffa173" />
        </BarChart>
      </ResponsiveContainer>

      <Table variant="simple" size={{ base: "sm", md: "md" }} width="100%">
        <Thead>
          <Tr>
            <Th textAlign="center" p={{ base: "1", md: "2" }}>
              {isLargerThanMD ? "Metrics" : ""}
            </Th>
            <Th textAlign="center" p={{ base: "1", md: "2" }}>
              {isLargerThanMD ? "Total" : "Tot."}
            </Th>
            <Th textAlign="center" p={{ base: "1", md: "2" }}>
              {isLargerThanMD ? "Completed" : "Comp."}
            </Th>
            <Th textAlign="center" p={{ base: "1", md: "2" }}>
              {isLargerThanMD ? "Completion Rate" : "C. Rate"}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td textAlign="center" p={{ base: "1", md: "2" }}>
              Tasks
            </Td>
            <Td textAlign="center" p={{ base: "1", md: "2" }}>
              {totalTasks}
            </Td>
            <Td textAlign="center" p={{ base: "1", md: "2" }}>
              {completedTasks}
            </Td>
            <Td textAlign="center" p={{ base: "1", md: "2" }}>
              {(taskStats.completionRate * 100).toFixed(2)}%
            </Td>
          </Tr>
          <Tr>
            <Td textAlign="center" p={{ base: "1", md: "2" }}>
              Goals
            </Td>
            <Td textAlign="center" p={{ base: "1", md: "2" }}>
              {totalGoals}
            </Td>
            <Td textAlign="center" p={{ base: "1", md: "2" }}>
              {completedGoals}
            </Td>
            <Td textAlign="center" p={{ base: "1", md: "2" }}>
              {(goalStats.completionRate * 100).toFixed(2)}%
            </Td>
          </Tr>
        </Tbody>
      </Table>

      {/* You can add more statistics and visualizations here, such as charts or graphs */}
    </VStack>
  );
};

export default MyStatsCard;
