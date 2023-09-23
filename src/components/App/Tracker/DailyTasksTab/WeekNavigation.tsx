import React, { useState } from "react";
import {
  Box,
  Icon,
  Text,
  Tooltip,
  Flex,
  Tabs,
  TabList,
  Tab,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import moment from "moment";
import { AiOutlineShareAlt } from "react-icons/ai";
import ShareProgressModal from "@/components/Modal/ShareProgress/ShareProgressModal";

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
  const startOfWeekDate = currentDate.format("MMM Do");
  const endOfWeekDate = currentDate
    .clone()
    .add(6, "days")
    .format("MMM Do, YYYY");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <Flex align="center" justify="space-between" h={12}>
      <Flex align="center">
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
      </Flex>
      <Flex>
        <Button
          variant="outline"
          rightIcon={<AiOutlineShareAlt />}
          onClick={openShareModal}
        >
          Share
        </Button>
      </Flex>

      {/* Share Progress Modal */}
      <ShareProgressModal isOpen={isShareModalOpen} onClose={closeShareModal} />

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
