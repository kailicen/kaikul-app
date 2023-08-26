import React from "react";
import {
  Box,
  Icon,
  Text,
  Tooltip,
  Flex,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { addDays, format } from "date-fns";

type WeekNavigationProps = {
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  startOfWeek: string;
  setActiveTab: (value: "me" | "team") => void; // <- Define this here
  activeTab: "me" | "team"; // New prop
};

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  onPreviousWeek,
  onNextWeek,
  startOfWeek,
  setActiveTab, // <- Add this here
  activeTab, // New argument
}) => {
  const currentDate = new Date(startOfWeek);
  const startOfWeekDate = format(currentDate, "MMM do");
  const endOfWeekDate = format(addDays(currentDate, 6), "MMM do, yyyy");

  const handleTabChange = (index: any) => {
    if (index === 0) {
      setActiveTab("me");
    } else if (index === 1) {
      setActiveTab("team");
    }
  };

  return (
    <Flex align="center" justify="space-between" h={12}>
      <Flex align="center">
        {activeTab === "me" && (
          <>
            <Tooltip label="Previous Week" placement="top">
              <Box
                as="button"
                aria-label="Previous Week"
                onClick={onPreviousWeek}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
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
              {startOfWeekDate} - {endOfWeekDate}
            </Text>
          </>
        )}
      </Flex>
      {/* <Flex align="center">
        <Tabs
          variant="soft-rounded"
          colorScheme="purple"
          defaultIndex={activeTab === "me" ? 0 : 1}
          onChange={handleTabChange}
          mr={{ base: 2, md: 10 }}
          mb={5}
        >
          <TabList>
            <Tab>Me</Tab>
            <Tab>Team</Tab>
          </TabList>
        </Tabs>
      </Flex> */}
    </Flex>
  );
};

export default WeekNavigation;
