import React, { useRef } from "react";
import "../styles/SpotlightCard.css"; // Import your CSS file for styles

interface Position {
  x: 10;
  y: 20;
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: string; // Accept CSS variable names like "--color-darkAccent"
  backgroundColor?: string; // Accept CSS variable names like "--color-darkAccent"
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "var(--color-darkAccent)", // Default to darkAccent
  backgroundColor = "var(--color-darkComponent)", // Default to darkComponent
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;

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
      className={`card-spotlight ${className}`}
      style={{
        backgroundColor: backgroundColor, // Set the background color dynamically
      }}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
