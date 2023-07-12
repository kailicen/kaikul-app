import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { FaComment } from "react-icons/fa";

function FloatingFeedbackButton() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleFeedbackClick = () => {
    window.open(
      "https://airtable.com/shrbtYEtI4p7SsWUo",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Box position="fixed" bottom="4" right="4">
      <Tooltip
        label="Provide Feedback"
        placement="left"
        isOpen={isTooltipOpen}
        onClose={() => setIsTooltipOpen(false)}
      >
        <IconButton
          aria-label="Feedback"
          icon={<FaComment />}
          size="lg"
          colorScheme="teal"
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseLeave={() => setIsTooltipOpen(false)}
          onClick={handleFeedbackClick}
        />
      </Tooltip>
    </Box>
  );
}

export default FloatingFeedbackButton;
