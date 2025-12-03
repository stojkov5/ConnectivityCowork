// src/components/Offices/Center/FloorPlan.jsx
import React from "react";

const FloorPlan = React.memo(
  ({ office, seats = [], onSeatClick, statusColors = {} }) => {
    if (!office) return null;

    const getFill = (status) =>
      statusColors[status] || statusColors.default || "#d1d5db";

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "70%",
          overflow: "hidden",
        }}
      >
        {office.image && (
          <img
            src={office.image}
            alt={`${office.name} floor plan`}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              top: 0,
              left: 0,
            }}
          />
        )}
        <svg
          viewBox={office.viewBox || "0 0 1000 1000"}
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}
        >
          {seats.map((seat) => (
            <path
              key={`${office.id}-${seat.id}`}
              d={office.getPathD(seat.id)}
              fill={getFill(seat.status)}
              fillOpacity="0.5"
              onClick={() => {
                if (seat.status === "free" || seat.status === "selected") {
                  onSeatClick(seat);
                }
              }}
              style={{
                cursor:
                  seat.status === "free" || seat.status === "selected"
                    ? "pointer"
                    : "not-allowed",
                transition: "fill 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.fillOpacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.fillOpacity = "0.5")}
            />
          ))}
        </svg>
      </div>
    );
  }
);

export default FloorPlan;
