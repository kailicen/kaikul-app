import { User } from "firebase/auth";
import Day from "./Day";
import { Box } from "@chakra-ui/react";
import { addDays, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

type Props = { user: User; currentWeekStart: string };

function WeekView({ user, currentWeekStart }: Props) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const startOfWeekZoned = utcToZonedTime(
    new Date(currentWeekStart),
    userTimeZone
  );

  return (
    <Box display="flex" justifyContent="space-between" w="100%" mb={10}>
      {Array.from({ length: 7 }).map((_, index) => {
        const dateZoned = addDays(startOfWeekZoned, index);
        const date = format(dateZoned, "yyyy-MM-dd");
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
