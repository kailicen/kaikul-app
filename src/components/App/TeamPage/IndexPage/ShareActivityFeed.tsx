import { useBuddyData } from "@/hooks/useBuddyData";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Box, VStack, Text, Link, Button, Grid } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserProfileCard, { UserProfile } from "../Components/UserProfileCard";
import { Buddy } from "@/atoms/buddyAtom";

type Props = {
  user: User;
  buddyId: string;
  buddy: Buddy | null;
};

const SharedActivityFeed: React.FC<Props> = ({ user, buddyId, buddy }) => {
  const router = useRouter();
  const [buddyProfile, setBuddyProfile] = useState<UserProfile | null>(null);
  const { fetchBuddyProfileById } = useBuddyData();
  const { profile } = useUserProfile(user);
  const showWeeklyUpdatesPage = (buddyId: string) => {
    router.push(`/team/weeklyupdates?buddyId=${buddyId}`);
  };

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
      <Button onClick={() => showWeeklyUpdatesPage(buddyId)}>
        View Team Weekly Updates
      </Button>
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
        width="100%"
      >
        <UserProfileCard user={user} profile={profile} />
        {buddyProfile && buddy && (
          <UserProfileCard buddy={buddy} profile={buddyProfile} />
        )}
      </Grid>
    </VStack>
  );
};

export default SharedActivityFeed;
