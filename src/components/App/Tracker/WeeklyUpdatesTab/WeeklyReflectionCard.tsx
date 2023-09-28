import { WeeklyReflection } from "@/atoms/weeklyReflectionAtom";
import { Box, Heading, Text, useColorMode } from "@chakra-ui/react";
import { format, parseISO, addDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

interface Props {
  record: WeeklyReflection;
  onClick: () => void;
}

export function WeeklyReflectionCard({ record, onClick }: Props) {
  const { colorMode } = useColorMode();

  // Get user's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startOfWeekDateUTC = parseISO(record.startOfWeek);
  const startOfWeekDate = utcToZonedTime(startOfWeekDateUTC, userTimeZone);
  const formattedStartOfWeek = format(startOfWeekDate, "MMM do");

  const endOfWeekDateUTC = addDays(startOfWeekDateUTC, 6);
  const endOfWeekDate = utcToZonedTime(endOfWeekDateUTC, userTimeZone);
  const formattedEndOfWeek = format(endOfWeekDate, "MMM do, yyyy");

  return (
    <Box
      key={record.id}
      onClick={onClick}
      mt={2}
      p={5}
      shadow="md"
      borderWidth="1px"
      flex="1"
      borderRadius="md"
      cursor="pointer"
      bg={colorMode === "light" ? "white" : "gray.700"}
      w="100%"
    >
      <Heading fontSize="lg">
        {formattedStartOfWeek} - {formattedEndOfWeek}
      </Heading>
      <Box display="flex" alignItems="center" mt={4} gap={2}>
        <Text fontWeight="semibold">Week Rating:</Text>
        <Text> {record.rateWeek}/10</Text>
      </Box>
      <Box display="flex" alignItems="center" mt={4} gap={2}>
        <Text fontWeight="semibold">Happiness Rating:</Text>
        <Text> {record.rateHappiness}/10</Text>
      </Box>
      <Box display="flex" alignItems="center" mt={4} gap={2}>
        <Text fontWeight="semibold">Practice Hours:</Text>
        <Text> {record.practiceHours}</Text>
      </Box>
      <Box display="flex" flexDirection="column" gap={1} mt={4}>
        <Text fontWeight="semibold">Biggest improvement:</Text>
        <Text> {record.biggestImprovement}</Text>
      </Box>
      <Box display="flex" flexDirection="column" gap={1} mt={4}>
        <Text fontWeight="semibold">Biggest obstacle:</Text>
        <Text> {record.biggestObstacle}</Text>
      </Box>
      <Box display="flex" flexDirection="column" gap={1} mt={4}>
        <Text fontWeight="semibold">Lesson Learned:</Text>
        <Text> {record.lessonLearned}</Text>
      </Box>
    </Box>
  );
}
