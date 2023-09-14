import { useColorMode } from "@chakra-ui/react";
import { TooltipProps } from "recharts";

export const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  const { colorMode } = useColorMode();
  const backgroundColor = colorMode === "dark" ? "#333" : "#fff";
  const textColor = colorMode === "dark" ? "#fff" : "#000";
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor,
          border: "1px solid #ccc",
          padding: "10px",
          color: textColor,
        }}
      >
        <p className="label">{`Date: ${label}`}</p>
        <p className="intro">{`Total: ${payload[0].value}`}</p>
        <p className="desc">{`Completed: ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};
