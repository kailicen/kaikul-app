import { Spinner, Flex, Box, useColorModeValue } from "@chakra-ui/react";

const LoadingScreen: React.FC = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");

  return (
    <Flex
      width="full"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bgColor={bgColor}
    >
      <Box textAlign="center">
        <Spinner size="xl" color={color} />
        <Box mt={4} fontSize="lg" color={color}>
          Loading...
        </Box>
      </Box>
    </Flex>
  );
};
export default LoadingScreen;
