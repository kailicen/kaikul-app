import { TooltipProps } from "recharts";

export const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
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
