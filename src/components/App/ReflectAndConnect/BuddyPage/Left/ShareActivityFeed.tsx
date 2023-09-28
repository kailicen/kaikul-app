import { useBuddyData } from "@/hooks/useBuddyData";
import { VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UserProfileCard from "./Components/UserProfileCard";
import { Buddy } from "@/atoms/buddyAtom";
import { UserProfile } from "@/atoms/userProfileAtom";

type Props = {
  buddyId: string;
  buddy: Buddy | null;
};

const SharedActivityFeed: React.FC<Props> = ({ buddyId, buddy }) => {
  const [buddyProfile, setBuddyProfile] = useState<UserProfile | null>(null);
  const { fetchBuddyProfileById } = useBuddyData();

  useEffect(() => {
    // Fetch buddy data when component mounts or buddyId changes
    const fetchBuddyProfileData = async () => {
      if (buddyId) {
        const fetchedBuddyProfile = await fetchBuddyProfileById(buddyId);
        if (fetchedBuddyProfile) {
          setBuddyProfile(fetchedBuddyProfile);
        }
      }
    };

    fetchBuddyProfileData();
  }, [buddyId, fetchBuddyProfileById]);

  return (
    <VStack spacing={4} w="full" alignItems="start">
      {/* <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
        width="100%"
      > */}
      {/* <UserProfileCard user={user} profile={profile} /> */}
      {buddyProfile && buddy && (
        <UserProfileCard buddy={buddy} profile={buddyProfile} />
      )}
      {/* </Grid> */}
    </VStack>
  );
};

export default SharedActivityFeed;
