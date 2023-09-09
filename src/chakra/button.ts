import { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "60px",
    fontSize: "10pt",
    fontWeight: 700,
    _focus: {
      boxShadow: "none",
    },
  },
  sizes: {
    sm: {
      fontSize: "8pt",
    },
    md: {
      fontSize: "10pt",
    },
  },
  variants: {
    solid: {
      color: "white",
      bg: "#4130AC",
      _hover: {
        bg: "#5140BD",
      },
    },
    outline: {
      _hover: {
        bg: "#8884d8",
      },
    },

    ghost: {
      color: "#4130AC",
      _hover: {
        bg: "#ded9ff",
      },
    },
    oauth: {
      height: "34px",
      border: "1px solid",
      borderColor: "gray.300",
      _hover: {
        bg: "gray.100",
      },
    },
    icon: {
      height: "30px",
      width: "30px",
    },
  },
};
