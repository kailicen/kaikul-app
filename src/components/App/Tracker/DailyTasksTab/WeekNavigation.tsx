import React, { useState } from "react";
import { Box, Icon, Text, Tooltip, Flex, Button } from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { AiOutlineShareAlt } from "react-icons/ai";
import ShareProgressModal from "@/components/Modal/ShareProgress/ShareProgressModal";
import { utcToZonedTime } from "date-fns-tz";
import { addDays, format, parseISO } from "date-fns";

type WeekNavigationProps = {
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  currentWeekStart: string;
};

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  onPreviousWeek,
  onNextWeek,
  currentWeekStart,
}) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentWeekStartDate = utcToZonedTime(
    parseISO(currentWeekStart),
    userTimeZone
  );
  const startOfWeekDate = format(currentWeekStartDate, "MMM do");
  const endOfWeekDate = format(
    addDays(currentWeekStartDate, 6),
    "MMM do, yyyy"
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <Flex align="center" justify="space-between" h={12} width="100%">
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
    </Flex>
  );
};

export default WeekNavigation;
