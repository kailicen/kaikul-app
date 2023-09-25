import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import LoadingScreen from "@/components/LoadingScreen";
import WeeklyUpdatesShare from "@/components/App/ReflectAndConnect/BuddyPage/WeeklyUpdatesShare/WeeklyUpdatesShare";
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import FloatingFeedbackButton from "@/components/App/FloatingFeedbackButton";

type Props = {};

function WeeklyUpdatePage({}: Props) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { buddyId: buddyIdQuery } = router.query;
  const buddyId = Array.isArray(buddyIdQuery) ? buddyIdQuery[0] : buddyIdQuery;

  // If Firebase auth or buddyId is not ready, show a loading indicator or return null
  if (loading || !buddyId || !user) {
    return <LoadingScreen />; // replace with your loading indicator if needed
  }

  return (
    <>
      <AuthenticatedHeader user={user} />
      {user ? (
        <div className="pt-[80px] container mx-auto">
          <Flex direction="column" width="100%">
            <Tabs
              colorScheme="purple"
              variant="enclosed"
              width="100%"
              mx="auto"
            >
              <TabList display="flex" justifyContent="center">
                <Tab>Weekly Updates</Tab>
                <Tab>Structured Agenda</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <WeeklyUpdatesShare user={user} buddyId={buddyId} />
                </TabPanel>

                <TabPanel>
                  <VStack>
                    <Link
                      href="https://www.canva.com/design/DAFjK3uvKW4/view?utm_content=DAFjK3uvKW4&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link"
                      isExternal
                      fontWeight="bold"
                    >
                      KaiKul Agenda & Theme <ExternalLinkIcon mx="2px" />
                    </Link>
                    <iframe
                      className="w-full h-[400px] md:h-[640px] max-w-screen-md mx-auto"
                      src="https://www.canva.com/design/DAFjK3uvKW4/view?embed"
                      allowFullScreen
                    ></iframe>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
          <FloatingFeedbackButton /> {/* Add the feedback button */}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default WeeklyUpdatePage;
