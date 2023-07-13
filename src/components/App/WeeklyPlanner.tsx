import React, { useState } from "react";
import GoalView from "./GoalView";
import WeekView from "./WeekView";
import { User } from "firebase/auth";
import { Flex, Text } from "@chakra-ui/react";
import WeekNavigation from "./WeekNavigation";
import moment from "moment";
import "moment/locale/en-gb";
import { useMediaQuery } from "@chakra-ui/react";
import Day from "./Day";
import DayNavigation from "./DayNavigation";
import FloatingFeedbackButton from "./FloatingFeedbackButton";

moment.updateLocale("en", {
  week: {
    dow: 1, // Monday is the first day of the week
  },
});

type Props = { user: User };

function WeeklyPlanner({ user }: Props) {
  const [activeTab, setActiveTab] = useState<"me" | "team">("me");

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const [startOfWeek, setStartOfWeek] = useState(
    moment().startOf("week").format("YYYY-MM-DD")
  );
  const [startOfDay, setStartOfDay] = useState(
    moment().startOf("day").format("YYYY-MM-DD")
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
    <Flex direction="column" gap={4}>
      {isLargerThan768 ? (
        <WeekNavigation
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          startOfWeek={startOfWeek}
          setActiveTab={setActiveTab} // <- Pass down the setActiveTab function
          activeTab={activeTab}
        />
      ) : (
        <DayNavigation
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          startOfDay={startOfDay}
          setActiveTab={setActiveTab} // <- Pass down the setActiveTab function
          activeTab={activeTab}
        />
      )}
      {activeTab === "me" ? (
        <>
          <GoalView
            user={user}
            startOfDay={startOfDay}
            startOfWeek={startOfWeek}
          />
          {isLargerThan768 ? (
            <WeekView user={user} startOfWeek={startOfWeek} />
          ) : (
            <Day user={user} date={startOfDay} />
          )}
        </>
      ) : isLargerThan768 ? (
        <Text>More feature to come...</Text>
      ) : (
        <div>More feature to come...</div>
      )}
      <FloatingFeedbackButton /> {/* Add the feedback button */}
    </Flex>
  );
}

export default WeeklyPlanner;
