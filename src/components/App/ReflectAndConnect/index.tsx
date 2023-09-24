import React from "react";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import ConnectTab from "./Connect";

type Props = { user: User };

function ConnectPage({ user }: Props) {
  return (
    <Flex direction="column" width="100%">
      <Tabs colorScheme="purple" variant="enclosed" width="100%" mx="auto">
        <TabList display="flex" justifyContent="center">
          <Tab>Connect</Tab>
          <Tab>More to Come...</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ConnectTab user={user} />
          </TabPanel>

          <TabPanel>
            <Text fontWeight="bold" fontSize="lg" mb="2">
              More features are on the horizon.
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default ConnectPage;
