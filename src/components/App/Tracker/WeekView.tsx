import { User } from "firebase/auth";
import moment from "moment";
import Day from "./Day";
import { Box } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { weekTaskListState } from "@/atoms/tasksAtom";
import useTasks from "@/hooks/useTasks";

type Props = { user: User; startOfWeek: string };

function WeekView({ user, startOfWeek }: Props) {
  const endOfWeek = moment(startOfWeek).add(6, "days").format("YYYY-MM-DD");

  return (
    <Box display="flex" justifyContent="space-between" w="full" mb={10}>
      {Array.from({ length: 7 }).map((_, index) => {
        const date = moment(startOfWeek)
          .add(index, "days")
          .format("YYYY-MM-DD");
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
