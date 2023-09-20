import { useBuddyUserProfiles } from "@/hooks/useBuddyUserProfiles";
import React from "react";
import BuddyProfileCard from "./BuddyProfileCard";
import { useRecoilState } from "recoil";
import { userProfileState } from "@/atoms/userProfileAtom";
import { Flex } from "@chakra-ui/react";

type Props = {};

function BuddyProfilesContainer({}: Props) {
  const [profile, setProfile] = useRecoilState(userProfileState);
  const { userProfiles, loading } = useBuddyUserProfiles(profile);

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
      {userProfiles.map((userProfile, index) => (
        <BuddyProfileCard
          key={index}
          userProfile={userProfile}
          w={["100%", "45%"]}
          mb={4}
        />
      ))}
    </Flex>
  );
}

export default BuddyProfilesContainer;
