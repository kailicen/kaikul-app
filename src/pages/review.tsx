import React from "react";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import { Box, Center, Grid } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import Connect from "@/components/App/ReflectAndConnect/Connect";
import FloatingFeedbackButton from "@/components/App/FloatingFeedbackButton";
import Reflect from "@/components/App/ReflectAndConnect/Reflect";
import { User } from "firebase/auth";

function Review() {
  const [user] = useAuthState(auth);

  return (
    <>
      <AuthenticatedHeader user={user} />
      <Box p={5} pt="100px">
        <Center>
          <Grid
            templateColumns={{ base: "1fr", md: "2fr 1fr" }}
            gap={10}
            w="1200px"
          >
            <Box order={{ base: 2, md: 1 }}>
              <Reflect />
            </Box>

            <Box order={{ base: 1, md: 2 }} p={2}>
              <Connect user={user as User} />
            </Box>
          </Grid>
          <FloatingFeedbackButton /> {/* Add the feedback button */}
        </Center>
      </Box>
    </>
  );
}

export default Review;
