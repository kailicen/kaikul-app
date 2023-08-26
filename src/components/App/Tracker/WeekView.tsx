import { User } from "firebase/auth";
import Day from "./Day";
import { Box } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { weekTaskListState } from "@/atoms/tasksAtom";
import { addDays, format } from "date-fns";

type Props = { user: User; startOfWeek: string };

function WeekView({ user, startOfWeek }: Props) {
  const currentDate = new Date(startOfWeek);
  const endOfWeek = format(addDays(currentDate, 6), "yyyy-MM-dd");

  const [weekTasks, setWeekTasks] = useRecoilState(
    weekTaskListState([startOfWeek, endOfWeek])
  );

  return (
    <Box display="flex" justifyContent="space-between" w="full" mb={10}>
      {Array.from({ length: 7 }).map((_, index) => {
        const date = format(addDays(currentDate, index), "yyyy-MM-dd");
        return (
          <Box key={index} flex="1">
            <Day date={date} user={user} recoilTasks={weekTasks} />
          </Box>
        );
      })}
    </Box>
  );
}

export default WeekView;
