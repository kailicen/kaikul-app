import React, { useState } from "react";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { onboardingState } from "@/atoms/onboardingAtom";
import OnboardingModal from "@/components/Modal/Me/OnboardingModal";
import { User } from "firebase/auth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserProfileAddition } from "@/hooks/useUserProfileAddition";
import SelfDiscovery from "./SelfDiscoveryTab";
import MyJourney from "./MyJourneyTab";
import Leaderboard from "./LeaderboardTab";
import { Theme } from "./SelfDiscoveryTab/ThemeOfTheWeekCard";

type Props = { user: User; posts: Theme[] };

function MePage({ user, posts }: Props) {
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const { loading, profile, updateProfile } = useUserProfile(user);
  const { profileAddition, updateProfileAddition } =
    useUserProfileAddition(user);
  const [tabIndex, setTabIndex] = useState(0); // default to the first tab

  return (
    <>
      {!loading && profile && (
        <Flex direction="column" width="100%">
          <Tabs
            colorScheme="purple"
            variant="enclosed"
            width="100%"
            mx="auto"
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
          >
            <TabList display="flex" justifyContent="center">
              <Tab>My Journey</Tab>
              <Tab>Leaderboard</Tab>
              <Tab>Self Discovery</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <MyJourney profile={profile} onEdit={updateProfile} />
              </TabPanel>

              <TabPanel>
                <Leaderboard onEdit={updateProfile} user={user} />
              </TabPanel>

              <TabPanel>
                <SelfDiscovery
                  profileAddition={profileAddition}
                  onEdit={updateProfileAddition}
                  posts={posts}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      )}

      {/* Check if onboarding is not complete, then show the modal */}
      {!loading && (
        <OnboardingModal
          isOpen={!onboarding.completed}
          onClose={() =>
            setOnboarding((prev) => ({ ...prev, completed: true }))
          }
          user={user as User}
        />
      )}
    </>
  );
}

export default MePage;
