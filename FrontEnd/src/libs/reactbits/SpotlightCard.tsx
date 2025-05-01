import React, { useRef } from "react";
// Import your CSS file for styles
import "./styles/SpotlightCard.css";

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: string; // Accept CSS variable names like "--color-darkAccent"
  backgroundColor?: string; // Accept CSS variable names like "--color-darkAccent"
  withBorder?: boolean; // Optional property to enable/disable border
  borderColor?: string; // Optional property to set the border color
  enableSpotlight?: boolean; // Optional property to enable/disable spotlight effect
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "var(--color-darkAccent)", // Default to darkAccent
  backgroundColor = "var(--color-darkComponent)", // Default to darkComponent
  withBorder = false, // Default to no border
  borderColor = "var(--color-darkAccent)", // Default border color
  enableSpotlight = true, // Default to enable spotlight
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current || !enableSpotlight) return; // Disable spotlight if enableSpotlight is false

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`card-spotlight ${withBorder ? "with-border" : ""} ${className} ${
        enableSpotlight ? "spotlight-enabled" : ""
      }`}
      style={{
        backgroundColor: backgroundColor, // Set the background color dynamically
        borderColor: withBorder ? borderColor : "transparent", // Set the border color dynamically
      }}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
