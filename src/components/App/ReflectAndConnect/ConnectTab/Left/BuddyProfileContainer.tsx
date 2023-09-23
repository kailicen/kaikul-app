import React from "react";
import BuddyProfileCard from "./BuddyProfileCard";
import { useRecoilState } from "recoil";
import { userProfileState } from "@/atoms/userProfileAtom";
import { Flex } from "@chakra-ui/react";
import { useBuddyData } from "@/hooks/useBuddyData";

type Props = {};

function BuddyProfilesContainer({}: Props) {
  const [profile, setProfile] = useRecoilState(userProfileState);
  const { buddyProfiles, loading } = useBuddyData();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex
      direction={["column", "row"]}
      wrap="wrap"
      justifyContent="space-around"
      gap={1}
    >
      {buddyProfiles.map((buddyProfile, index) => (
        <BuddyProfileCard
          key={index}
          userProfile={buddyProfile}
          w={["100%", "45%"]}
          mb={4}
        />
      ))}
    </Flex>
  );
}

export default BuddyProfilesContainer;
