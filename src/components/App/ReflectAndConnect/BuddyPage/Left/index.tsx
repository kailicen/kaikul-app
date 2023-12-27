import { VStack } from "@chakra-ui/react";
import React from "react";
import { Grid } from "@chakra-ui/react";
import { useBuddyData } from "@/hooks/useBuddyData";
import FloatingFeedbackButton from "@/components/App/FloatingFeedbackButton";
import TeamHeader from "@/components/App/ReflectAndConnect/BuddyPage/Left/TeamHeader";
import SharedActivityFeed from "./ShareActivityFeed";
import ChatSection from "./ChatSection";
import { Buddy } from "@/atoms/buddyAtom";
import { User } from "firebase/auth";

type Props = {
  user: User;
  selectedBuddy: Buddy | null;
};

function LeftSection({ user, selectedBuddy }: Props) {
  return (
    <VStack gap={4} align="start" w="100%">
      {selectedBuddy ? (
        <>
          <TeamHeader user={user} buddy={selectedBuddy} />
          {/* ... other components with the buddy data ... */}
          <Grid
            templateColumns={{ base: "1fr", lg: "5fr 3fr" }}
            gap={4}
            width="100%"
          >
            <ChatSection user={user} buddy={selectedBuddy} />
            <SharedActivityFeed
              buddyId={selectedBuddy.id}
              buddy={selectedBuddy}
            />
            {/* <TeamActions /> */}
          </Grid>
          {/* <FloatingFeedbackButton />  */}
        </>
      ) : (
        <div>Select a buddy to view details</div>
      )}
    </VStack>
  );
}

export default LeftSection;
