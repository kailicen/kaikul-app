import React, { useState } from "react";
import GoalView from "./GoalView";
import WeekView from "./WeekView";
import { User } from "firebase/auth";
import { VStack } from "@chakra-ui/react";
import WeekNavigation from "./WeekNavigation";
import "moment/locale/en-gb";
import { useMediaQuery } from "@chakra-ui/react";
import Day from "./Day";
import DayNavigation from "./DayNavigation";
import {
  startOfWeek,
  startOfDay,
  format,
  addDays,
  subWeeks,
  addWeeks,
  subDays,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

type Props = { user: User };

function WeeklyPlanner({ user }: Props) {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const nowInUserTimezone = utcToZonedTime(new Date(), userTimeZone);

  const weekStartInUserTimezone = startOfWeek(nowInUserTimezone, {
    weekStartsOn: 1,
  });
  const dayStartInUserTimezone = startOfDay(nowInUserTimezone);

  // Updated useState with new variable names:
  const [currentWeekStart, setCurrentWeekStart] = useState(
    format(weekStartInUserTimezone, "yyyy-MM-dd")
  );
  const [currentDayStart, setCurrentDayStart] = useState(
    format(dayStartInUserTimezone, "yyyy-MM-dd")
  );

  const handlePreviousWeek = () => {
    const newWeekStart = subWeeks(new Date(currentWeekStart), 1);
    setCurrentWeekStart(format(newWeekStart, "yyyy-MM-dd"));
  };

  const handleNextWeek = () => {
    const newWeekStart = addWeeks(new Date(currentWeekStart), 1);
    setCurrentWeekStart(format(newWeekStart, "yyyy-MM-dd"));
  };

  const handlePreviousDay = () => {
    const newDayStart = subDays(new Date(currentDayStart), 1);
    setCurrentDayStart(format(newDayStart, "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    const newDayStart = addDays(new Date(currentDayStart), 1);
    setCurrentDayStart(format(newDayStart, "yyyy-MM-dd"));
  };

  return (
    <VStack width="100%">
      {isLargerThan768 ? (
        <WeekNavigation
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          currentWeekStart={currentWeekStart}
        />
      ) : (
        <DayNavigation
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          currentDayStart={currentDayStart}
        />
      )}
      <GoalView
        user={user}
        currentDayStart={currentDayStart}
        currentWeekStart={currentWeekStart}
      />
      {isLargerThan768 ? (
        <WeekView user={user} currentWeekStart={currentWeekStart} />
      ) : (
        <Day user={user} date={currentDayStart} />
      )}
    </VStack>
  );
}

export default WeeklyPlanner;
