import React from "react";
import { Grid, VStack } from "@chakra-ui/react";
import WeeklyUpdateSection from "./WeeklyUpdateSection";
import { User } from "firebase/auth";
import MyCommunityInfo from "./MyCommunityInfo";

type Props = { user: User };

const Reflect: React.FC<Props> = ({ user }) => {
  // const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  // const handleInstructionOpen = () => {
  //   setIsInstructionOpen(true);
  // };

  // const handleInstructionClose = () => {
  //   setIsInstructionOpen(false);
  // };

  return (
    <VStack width="100%" pt={5} px={{ base: 0, md: 10 }}>
      {/* <Text fontWeight="bold" fontSize="lg" mb="2">
        Weekly Updates{" "}
        <InfoIcon
          color="purple.500"
          onClick={handleInstructionOpen}
          mb={1}
          cursor="pointer"
        />
      </Text>
      <MyJourneyModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      /> */}
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={6}
        width="100%"
      >
        <WeeklyUpdateSection />
        <MyCommunityInfo />
      </Grid>
    </VStack>
  );
};

export default Reflect;
