import React from "react";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import Reflect from "./WeeklyUpdatesTab";
import WeeklyPlanner from "./DailyTasksTab";

type Props = { user: User };

function TrackerPage({ user }: Props) {
  return (
    <Flex direction="column" width="100%">
      <Tabs colorScheme="purple" variant="enclosed" width="100%">
        <TabList display="flex" justifyContent="center" width="100%">
          <Tab>Daily Tasks</Tab>
          <Tab>Weekly Updates</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <WeeklyPlanner user={user} />
          </TabPanel>

          <TabPanel>
            <Reflect user={user} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default TrackerPage;
