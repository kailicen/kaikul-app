import React from "react";
import { Box, Icon, Text, Tooltip, Flex, Button } from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import moment from "moment";

type WeekNavigationProps = {
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  startOfWeek: string;
};

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  onPreviousWeek,
  onNextWeek,
  startOfWeek,
}) => {
  const currentDate = moment(startOfWeek);
  const currentMonth = currentDate.format("MMM YYYY");
  const nextWeek = currentDate.clone().add(1, "week");
  const nextMonth = nextWeek.format("MMM YYYY");

  const isTransitionWeek = currentDate.month() !== nextWeek.month();

  return (
    <Flex align="center" justify="space-between">
      <Flex align="center">
        <Tooltip label="Previous Week" placement="top">
          <Box
            as="button"
            aria-label="Previous Week"
            onClick={onPreviousWeek}
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            p={1}
            rounded="md"
          >
            <Icon as={MdChevronLeft} fontSize="24px" color="gray.500" />
          </Box>
        </Tooltip>
        <Tooltip label="Next Week" placement="top">
          <Box
            as="button"
            aria-label="Next Week"
            onClick={onNextWeek}
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            p={1}
            rounded="md"
            ml={2}
          >
            <Icon as={MdChevronRight} fontSize="24px" color="gray.500" />
          </Box>
        </Tooltip>
        <Text fontSize="xl" fontWeight="semibold" ml={2}>
          {isTransitionWeek ? (
            <>
              <Text display="inline" mr={1}>
                {currentMonth.split(" ")[0]}
              </Text>
              <Text display="inline" color="gray.500" fontSize="sm">
                -
              </Text>
              <Text display="inline" ml={1}>
                {nextMonth}
              </Text>
            </>
          ) : (
            currentMonth
          )}
        </Text>
      </Flex>
      {/* <Flex align="center">
        <Button
          colorScheme="gray"
          variant="outline"
          borderRadius="md"
          _hover={{ bg: "gray.100" }}
          mr={1}
        >
          Week
        </Button>
        <Button
          colorScheme="gray"
          variant="outline"
          borderRadius="md"
          _hover={{ bg: "gray.100" }}
        >
          Day
        </Button>
      </Flex> */}
    </Flex>
  );
};

export default WeekNavigation;
