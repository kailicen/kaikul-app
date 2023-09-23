import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import LoadingScreen from "@/components/LoadingScreen";
import { Buddy } from "@/atoms/buddyAtom";
import {
  Button,
  Grid,
  IconButton,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useBuddyData } from "@/hooks/useBuddyData";
import ChatSection from "@/components/App/TeamPage/IndexPage/ChatSection";
import SharedActivityFeed from "@/components/App/TeamPage/IndexPage/ShareActivityFeed";
import TeamHeader from "@/components/App/TeamPage/IndexPage/TeamHeader";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { IoChevronBack } from "react-icons/io5";

type Props = {};

function TeamPage({}: Props) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { buddyId: buddyIdQuery } = router.query;
  const buddyId = Array.isArray(buddyIdQuery) ? buddyIdQuery[0] : buddyIdQuery;
  const { fetchBuddyById } = useBuddyData();
  const [buddy, setBuddy] = useState<Buddy | null>(null);

  const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });

  useEffect(() => {
    // Fetch buddy data when component mounts or buddyId changes
    const fetchBuddyData = async () => {
      if (buddyId) {
        const fetchedBuddy = await fetchBuddyById(buddyId);
        if (fetchedBuddy) {
          setBuddy(fetchedBuddy);
        }
      }
    };

    fetchBuddyData();
  }, [buddyId, fetchBuddyById]);

  // If Firebase auth or buddyId is not ready, show a loading indicator or return null
  if (loading || !buddyId || !user) {
    return <LoadingScreen />; // replace with your loading indicator if needed
  }

  return (
    <>
      <AuthenticatedHeader user={user} />
      <div className="container mx-auto top-[80px] relative">
        {breakpoint === "base" ? (
          <IconButton
            position="absolute"
            top={2}
            left={2}
            aria-label="Back to Team"
            icon={<ArrowBackIcon />}
            onClick={() => router.push("/review")}
            borderRadius="full"
          />
        ) : (
          <Button
            leftIcon={<IoChevronBack />}
            variant="ghost"
            position="absolute"
            top={2}
            left={2}
            onClick={() => router.push("/review")}
          >
            Back to Connect
          </Button>
        )}
        <VStack spacing={4} p={2} width="100%">
          <TeamHeader user={user} buddy={buddy as Buddy} />
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={4}
            width="100%"
          >
            <SharedActivityFeed user={user} buddyId={buddyId} buddy={buddy} />
            <ChatSection user={user} buddy={buddy} />
            {/* <TeamActions /> */}
          </Grid>
        </VStack>
      </div>
    </>
  );
}

export default TeamPage;
