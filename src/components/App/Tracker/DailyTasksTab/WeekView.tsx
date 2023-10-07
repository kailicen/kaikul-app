import { User } from "firebase/auth";
import Day from "./Day";
import { Box } from "@chakra-ui/react";
import { addDays, format, startOfWeek } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

type Props = { user: User; currentWeekStart: string };

function WeekView({ user, currentWeekStart }: Props) {
  console.log("Received currentWeekStart in WeekView:", currentWeekStart);

  const adjustedDate = new Date(`${currentWeekStart}T12:00:00`); // Set to noon

  return (
    <Box display="flex" justifyContent="space-between" w="100%" mb={10}>
      {Array.from({ length: 7 }).map((_, index) => {
        const dateZoned = addDays(adjustedDate, index);
        const date = format(dateZoned, "yyyy-MM-dd");
        console.log(`Day ${index + 1} date:`, date); // Logging each date
        return (
          <Box key={index} flex="1">
            <Day date={date} user={user} />
          </Box>
        );
      })}
    </Box>
  );
}

export default WeekView;
