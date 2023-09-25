import React, { useEffect, useState } from "react";
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
import MyBuddiesTab from "./BuddyPage";
import { useRouter } from "next/router";

type Props = { user: User };

function ConnectPage({ user }: Props) {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  // On component mount, check if there's a tab query parameter to set the initial tab index
  useEffect(() => {
    if (router.query.tab === "buddies") {
      setTabIndex(1);
    }
  }, [router.query]);

  // Update the tab state and also the URL when a tab is clicked
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    if (index === 0) {
      router.push("/connect"); // replace with your actual path
    } else if (index === 1) {
      router.push("/connect?tab=buddies"); // replace with your actual path
    }
  };
  return (
    <Flex direction="column" width="100%">
      <Tabs
        colorScheme="purple"
        variant="enclosed"
        width="100%"
        mx="auto"
        index={tabIndex}
        onChange={handleTabsChange}
      >
        <TabList display="flex" justifyContent="center">
          <Tab>Connect</Tab>
          <Tab>My Buddies</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ConnectTab user={user} />
          </TabPanel>

          <TabPanel>
            <MyBuddiesTab user={user} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default ConnectPage;
