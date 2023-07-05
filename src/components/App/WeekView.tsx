import { User } from "firebase/auth";
import moment from "moment";
import Day from "./Day";
import { Box } from "@chakra-ui/react";

type Props = { user: User; startOfWeek: string };

function WeekView({ user, startOfWeek }: Props) {
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
