import { Box, VStack, Text, Link, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

type Props = {
  buddyId: string;
};

const SharedActivityFeed: React.FC<Props> = ({ buddyId }) => {
  const router = useRouter();
  const showWeeklyUpdatesPage = (buddyId: string) => {
    router.push(`/team/weeklyupdates?buddyId=${buddyId}`);
  };

  return (
    <VStack spacing={4} w="full">
      <Button onClick={() => showWeeklyUpdatesPage(buddyId)}>
        Join Weekly Update Catchup
      </Button>
    </VStack>
  );
};

export default SharedActivityFeed;
