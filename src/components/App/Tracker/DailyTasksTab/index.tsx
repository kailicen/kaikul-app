import React, { useState } from "react";
import GoalView from "./GoalView";
import WeekView from "./WeekView";
import { User } from "firebase/auth";
import { Flex } from "@chakra-ui/react";
import WeekNavigation from "./WeekNavigation";
import moment from "moment";
import "moment/locale/en-gb";
import { useMediaQuery } from "@chakra-ui/react";
import Day from "./Day";
import DayNavigation from "./DayNavigation";
import { useRecoilState } from "recoil";
import { weekTaskListState } from "@/atoms/tasksAtom";

moment.updateLocale("en", {
  week: {
    dow: 1, // Monday is the first day of the week
  },
});

type Props = { user: User };

function WeeklyPlanner({ user }: Props) {
  // might have future feature regarding to me/team tab
  const [activeTab, setActiveTab] = useState<"me" | "team">("me");

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const [startOfWeek, setStartOfWeek] = useState(
    moment().startOf("week").format("YYYY-MM-DD")
  );
  const [startOfDay, setStartOfDay] = useState(
    moment().startOf("day").format("YYYY-MM-DD")
  );

  const endOfWeek = moment(startOfWeek).add(6, "days").format("YYYY-MM-DD");
  const [weekTasks, setWeekTasks] = useRecoilState(
    weekTaskListState([startOfWeek, endOfWeek])
  );

  const handlePreviousWeek = () => {
    setStartOfWeek(
      moment(startOfWeek).subtract(1, "week").format("YYYY-MM-DD")
    );
  };

  const handleNextWeek = () => {
    setStartOfWeek(moment(startOfWeek).add(1, "week").format("YYYY-MM-DD"));
  };

  const handlePreviousDay = () => {
    setStartOfDay(moment(startOfDay).subtract(1, "day").format("YYYY-MM-DD"));
  };

  const handleNextDay = () => {
    setStartOfDay(moment(startOfDay).add(1, "day").format("YYYY-MM-DD"));
  };

  return (
    <>
      {isLargerThan768 ? (
        <WeekNavigation
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          startOfWeek={startOfWeek}
        />
      ) : (
        <DayNavigation
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          startOfDay={startOfDay}
        />
      )}
      <GoalView user={user} startOfDay={startOfDay} startOfWeek={startOfWeek} />
      {isLargerThan768 ? (
        <WeekView user={user} startOfWeek={startOfWeek} />
      ) : (
        <Day user={user} date={startOfDay} />
      )}
    </>
  );
}

export default WeeklyPlanner;
