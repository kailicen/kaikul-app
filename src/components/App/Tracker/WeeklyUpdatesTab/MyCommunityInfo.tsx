import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";

function MyCommunityInfo() {
  return (
    <VStack width="100%">
      <Text size="md" mb={2} fontWeight="semibold" width="100%">
        Team Accountability
      </Text>
      <Accordion allowMultiple width="100%">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Slack Community
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Join our{" "}
            <Link
              color="purple.500"
              fontWeight="bold"
              href="https://join.slack.com/t/kaikul/shared_invite/zt-22ty7x0ps-89ruM2VXwB1v49yY35cYdw"
              isExternal
            >
              Slack community
            </Link>{" "}
            for the latest product updates, developmental resources, and daily
            task reports.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Weekly Sessions
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Begin by enrolling in the #find-your-buddy channel on Slack, or
            connect with people on our Connect Page. Feel free to introduce
            yourself and interact with prospective buddies. Plan for a weekly
            call with your buddy. Check the{" "}
            <Link
              color="purple.500"
              fontWeight="bold"
              href="https://www.canva.com/design/DAFjK3uvKW4/sNhHTl74eTJQZAh5DpjfIw/view"
              isExternal
            >
              session agenda
            </Link>{" "}
            to understand what will be discussed.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}

export default MyCommunityInfo;
