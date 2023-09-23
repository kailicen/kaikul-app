import React from "react";
import BuddyProfileCard from "./BuddyProfileCard";
import { useRecoilState } from "recoil";
import { userProfileState } from "@/atoms/userProfileAtom";
import { Grid } from "@chakra-ui/react";
import { useBuddyData } from "@/hooks/useBuddyData";

type Props = {};

function BuddyProfilesContainer({}: Props) {
  const [profile, setProfile] = useRecoilState(userProfileState);
  const { buddyProfiles, loading } = useBuddyData();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={4} width="100%">
      {buddyProfiles.map((buddyProfile, index) => (
        <BuddyProfileCard key={index} userProfile={buddyProfile} />
      ))}
    </Grid>
  );
}

export default BuddyProfilesContainer;
