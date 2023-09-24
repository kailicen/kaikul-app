import { Box, useColorMode } from "@chakra-ui/react";

interface NotificationCardProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  onClick,
  children,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      as="button"
      w="full"
      boxShadow="md"
      p={4}
      rounded="md"
      border="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      bg={colorMode === "light" ? "white" : "gray.800"}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};
