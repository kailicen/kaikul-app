import React from "react";
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
import JourneyMode from "./JourneyMode";
import SelfDiscovery from "./SelfDiscovery";
import MyJourney from "./MyJourney/MyJourney";

type Props = { user: User };

function MePage({ user }: Props) {
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const { loading, profile, updateProfile } = useUserProfile(user);
  const { profileAddition, updateProfileAddition } =
    useUserProfileAddition(user);

  return (
    <>
      {!loading && profile && (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          w="full"
        >
          <Tabs colorScheme="purple" variant="enclosed">
            <TabList mb="1em" display="flex" justifyContent="center">
              <Tab>My Journey</Tab>
              <Tab>Journey Mode</Tab>
              <Tab>Self Discovery</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <MyJourney profile={profile} onEdit={updateProfile} />
              </TabPanel>

              <TabPanel>
                <JourneyMode
                  profile={profile}
                  onEdit={updateProfile}
                  user={user}
                />
              </TabPanel>

              <TabPanel>
                <SelfDiscovery
                  profileAddition={profileAddition}
                  onEdit={updateProfileAddition}
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
