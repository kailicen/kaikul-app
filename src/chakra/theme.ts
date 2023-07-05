// theme.ts

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

// 3. extend the theme

export const theme = extendTheme({
  config,
  colors: {
    // Customize the background and text colors here
    // Use your desired color values
    // For example, setting the background to white and text to black
    bg: "#ffffff",
    text: "#000000",
  },
  // ... other theme customizations
  components: {
    Button,
  },
});
