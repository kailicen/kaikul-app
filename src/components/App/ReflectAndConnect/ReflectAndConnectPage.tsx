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
import Reflect from "./ReflectTab/Reflect";
import Connect from "./ConnectTab/Connect";

type Props = { user: User };

function ReflectAndConnectPage({ user }: Props) {
  return (
    <Flex direction="column" width="100%">
      <Tabs colorScheme="purple" variant="enclosed" width="100%" mx="auto">
        <TabList mb="1em" display="flex" justifyContent="center">
          <Tab>Reflect</Tab>
          <Tab>Connect</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Reflect user={user} />
          </TabPanel>

          <TabPanel>
            <Connect user={user} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default ReflectAndConnectPage;
