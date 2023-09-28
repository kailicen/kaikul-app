import { VStack, Button } from "@chakra-ui/react";

const TeamActions: React.FC = () => {
  const endPartnership = () => {
    // Firebase logic to end partnership
  };

  return (
    <VStack spacing={4}>
      <Button colorScheme="red" onClick={endPartnership}>
        End Partnership
      </Button>
      {/* Add more actions if needed */}
    </VStack>
  );
};

export default TeamActions;
