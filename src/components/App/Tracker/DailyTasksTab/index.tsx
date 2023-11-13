import React, { useEffect, useState } from "react";
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
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type Props = { user: User };

function WeeklyPlanner({ user }: Props) {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    // Update isPanelOpen based on screen size after component mounts
    setIsPanelOpen(isLargerThan768);
  }, [isLargerThan768]); // dependency on isLargerThan768

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

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
  console.log("Current Week Start:", currentWeekStart);
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
    <DndProvider backend={HTML5Backend}>
      <VStack
        position="relative"
        ml={isPanelOpen && isLargerThan768 ? "300px" : "0"}
        width={isPanelOpen && isLargerThan768 ? "calc(100% - 300px)" : "100%"}
        transition="margin-left 0.3s ease, width 0.3s ease"
      >
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
          onTogglePanel={togglePanel}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
        />

        {isLargerThan768 ? (
          <WeekView user={user} currentWeekStart={currentWeekStart} />
        ) : (
          <Day user={user} date={currentDayStart} />
        )}
      </VStack>
    </DndProvider>
  );
}

export default WeeklyPlanner;
