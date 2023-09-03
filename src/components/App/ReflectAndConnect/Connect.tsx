import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Heading,
  Link,
  Stack,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import AddBuddy from "./AddBuddy";
import BuddyRequestsModal from "@/components/Modal/Connect/BuddyRequestsModal";
import BuddyList from "./BuddyList";
import { useRecoilValue } from "recoil";
import { buddyRequestState } from "@/atoms/buddyRequestsAtom";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";

type Props = { user: User };

function Connect({ user }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [buddyIds, setBuddyIds] = useState<string[]>([]);

  // Use Recoil value to get buddyRequests
  const buddyRequests = useRecoilValue(buddyRequestState);

  // Calculate pendingRequests
  const pendingRequests = buddyRequests.filter(
    (request) => request.status === "pending"
  ).length;

  // Fetch buddy IDs when the component mounts
  useEffect(() => {
    const fetchBuddyIds = async () => {
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data);
          setBuddyIds(data.buddies || []); // replace 'buddies' with the actual field name in your Firestore
        }
      }
    };

    fetchBuddyIds();
  }, [user, pendingRequests]);

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md" mb={2}>
        Team Accountability
      </Heading>
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Slack Community
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Join our{" "}
            <Link
              color="purple.500"
              fontWeight="bold"
              href="https://join.slack.com/t/kaikul/shared_invite/zt-22ty7x0ps-89ruM2VXwB1v49yY35cYdw"
              isExternal
            >
              Slack community
            </Link>{" "}
            for the latest product updates, developmental resources, and daily
            task reports.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Weekly Sessions
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Begin by enrolling in the #find-your-buddy channel on Slack. Feel
            free to introduce yourself and interact with prospective buddies.
            Plan for a weekly call with your buddy. Check the{" "}
            <Link
              color="purple.500"
              fontWeight="bold"
              href="https://www.canva.com/design/DAFjK3uvKW4/sNhHTl74eTJQZAh5DpjfIw/view"
              isExternal
            >
              session agenda
            </Link>{" "}
            to understand what will be discussed.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {/* The right part of the page */}

      <Heading size="md" mt={3} mb={2}>
        My Buddies
      </Heading>
      <Stack direction="row" justifyContent="space-between">
        <AddBuddy />
        <Button variant="outline" onClick={onOpen}>
          View Requests
          {pendingRequests > 0 && (
            <Badge
              ml="1"
              colorScheme="red"
              borderRadius="full"
              position="absolute"
              top="-1"
              right="-1"
            >
              {pendingRequests}
            </Badge>
          )}
        </Button>
        <BuddyRequestsModal isOpen={isOpen} onClose={onClose} />
      </Stack>
      <BuddyList buddyIds={buddyIds} user={user} />
    </VStack>
  );
}

export default Connect;
