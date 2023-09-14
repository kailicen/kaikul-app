// theme.ts

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

const config = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

// 3. extend the theme

export const theme = extendTheme({
  config,
  colors: {
    bg: "#ffffff",
    text: "#000000",
    brand: {
      50: "#f2ebf9", // Lightest shade
      100: "#dbcdf7",
      200: "#c5afee",
      300: "#ae92e6",
      400: "#9874dd",
      500: "#4130AC", // Your brand color
      600: "#392594",
      700: "#301b7b",
      800: "#271163",
      900: "#1d084a", // Darkest shade
    },
  },
  // ... other theme customizations
  components: {
    Button,
  },
});
