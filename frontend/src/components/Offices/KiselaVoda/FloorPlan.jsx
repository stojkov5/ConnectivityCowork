// FloorPlan.jsx
import React from "react";

const FloorPlan = React.memo(
  ({ rooms = [], onRoomClick, statusColors = {} }) => {
    const getFill = (status) =>
      statusColors[status] || statusColors.default || "#d1d5db";

    const getPathD = (id) =>
      ({
        "room-1": "M156.5 264V113.5H297.5V264H156.5Z",
        "room-2": "M463 71V265.5H299V71H463Z",
        "room-3": "M155.5 715V537.5H403V715H155.5Z",
        "room-4":
          "M572.5 782H397.5V742.5H404V543L480.5 540V623.5H572.5V782Z",
        "room-5":
          "M511 134H578L571 76.5H671V265.5H571V277.5H511V134Z",
        "room-6": "M816 38.5H672V182H816V38.5Z",
        "room-7": "M720 275H863.5V406H720V275Z",
        "room-8": "M575 541.5H862V718H575V541.5Z",
      }[id] || "");

    return (
      <div style={{ position: "relative", width: "100%", paddingBottom: "70%" }}>
        <img
          src="/KiselaVoda.svg"
          alt="Floor plan"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
        <svg
          viewBox="0 0 966 823"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {rooms.map((room) => (
            <path
              key={room.id}
              d={getPathD(room.id)}
              fill={getFill(room.status)}
              fillOpacity="0.5"
              style={{
                cursor:
                  room.status === "free" || room.status === "selected"
                    ? "pointer"
                    : "not-allowed",
                transition: "fill 0.3s ease",
              }}
              onClick={() => {
                if (
                  room.status === "free" ||
                  room.status === "selected"
                ) {
                  onRoomClick(room);
                }
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
