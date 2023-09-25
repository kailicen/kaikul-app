import React, { useState } from "react";
import {
  Box,
  Icon,
  Text,
  Tabs,
  TabList,
  Tab,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import moment from "moment";
import { AiOutlineShareAlt } from "react-icons/ai";
import ShareProgressModal from "@/components/Modal/ShareProgress/ShareProgressModal";

type DayNavigationProps = {
  onPreviousDay: () => void;
  onNextDay: () => void;
  startOfDay: string;
};

const DayNavigation: React.FC<DayNavigationProps> = ({
  onPreviousDay,
  onNextDay,
  startOfDay,
}) => {
  const currentDate = moment(startOfDay);
  const currentDay = currentDate.format("DD MMM YYYY");

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <Flex align="center" justify="space-between" width="100%">
      <Flex align="center">
        <Box
          as="button"
          aria-label="Previous Day"
          onClick={onPreviousDay}
          cursor="pointer"
          _hover={{ bg: "gray.100" }}
          p={1}
          rounded="md"
        >
          <Icon as={MdChevronLeft} fontSize="24px" color="gray.500" />
        </Box>
        <Box
          as="button"
          aria-label="Next Day"
          onClick={onNextDay}
          cursor="pointer"
          _hover={{ bg: "gray.100" }}
          p={1}
          rounded="md"
          ml={2}
        >
          <Icon as={MdChevronRight} fontSize="24px" color="gray.500" />
        </Box>
        <Text fontSize="xl" fontWeight="semibold" ml={2}>
          {currentDay}
        </Text>
      </Flex>
      <Flex>
        <IconButton
          aria-label="share"
          icon={<AiOutlineShareAlt />}
          onClick={openShareModal}
          borderRadius="full"
          size="md"
          variant="outline"
        />
      </Flex>
      {/* Share Progress Modal */}
      <ShareProgressModal isOpen={isShareModalOpen} onClose={closeShareModal} />
    </Flex>
  );
};

export default DayNavigation;
