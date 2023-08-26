import React, { useState } from "react";
import GoalView from "./GoalView";
import WeekView from "./WeekView";
import { User } from "firebase/auth";
import { Flex } from "@chakra-ui/react";
import WeekNavigation from "./WeekNavigation";
import { useMediaQuery } from "@chakra-ui/react";
import Day from "./Day";
import DayNavigation from "./DayNavigation";
import FloatingFeedbackButton from "../FloatingFeedbackButton";
import { useRecoilState } from "recoil";
import { weekTaskListState } from "@/atoms/tasksAtom";
import {
  startOfWeek as startOfWeekFns,
  format,
  addDays,
  addWeeks,
  subWeeks,
  startOfDay as startOfDayFns,
  subDays,
} from "date-fns";

type Props = { user: User };

function WeeklyPlanner({ user }: Props) {
  const [activeTab, setActiveTab] = useState<"me" | "team">("me");
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const [startOfWeek, setStartOfWeek] = useState(
    format(startOfWeekFns(new Date()), "yyyy-MM-dd")
  );

  const [startOfDay, setStartOfDay] = useState(
    format(startOfDayFns(new Date()), "yyyy-MM-dd")
  );

  const endOfWeek = format(addDays(new Date(startOfWeek), 6), "yyyy-MM-dd");

  const [weekTasks, setWeekTasks] = useRecoilState(
    weekTaskListState([startOfWeek, endOfWeek])
  );

  const handlePreviousWeek = () => {
    setStartOfWeek(format(subWeeks(new Date(startOfWeek), 1), "yyyy-MM-dd"));
  };

  const handleNextWeek = () => {
    setStartOfWeek(format(addWeeks(new Date(startOfWeek), 1), "yyyy-MM-dd"));
  };

  const handlePreviousDay = () => {
    setStartOfDay(format(subDays(new Date(startOfDay), 1), "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    setStartOfDay(format(addDays(new Date(startOfDay), 1), "yyyy-MM-dd"));
  };

  return (
    <Flex direction="column" gap={2}>
      {isLargerThan768 ? (
        <WeekNavigation
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          startOfWeek={startOfWeek}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      ) : (
        <DayNavigation
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          startOfDay={startOfDay}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      )}
      <GoalView user={user} startOfDay={startOfDay} startOfWeek={startOfWeek} />
      {isLargerThan768 ? (
        <WeekView user={user} startOfWeek={startOfWeek} />
      ) : (
        <Day user={user} date={startOfDay} recoilTasks={weekTasks} />
      )}
      <FloatingFeedbackButton />
    </Flex>
  );
}

export default WeeklyPlanner;
