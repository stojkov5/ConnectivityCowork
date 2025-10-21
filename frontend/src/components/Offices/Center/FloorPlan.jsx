const FloorPlan = ({ office, seats, onSeatClick, statusColors }) => {
  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "70%", overflow: "hidden" }}>
      <img
        src={office.image}
        alt={`${office.name} floor plan`}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", top: 0, left: 0 }}
      />
      <svg
        viewBox={office.viewBox}
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}
      >
        {seats.map((seat) => (
          <path
            key={`${office.id}-${seat.id}`}
            d={office.getPathD(seat.id)}
            fill={statusColors[seat.status] || "#ccc"}
            fillOpacity="0.5"
            onClick={() => seat.status === "free" && onSeatClick(seat)}
            style={{ cursor: seat.status === "free" ? "pointer" : "not-allowed", transition: "fill 0.3s ease" }}
            onMouseEnter={(e) => (e.target.style.fillOpacity = "0.7")}
            onMouseLeave={(e) => (e.target.style.fillOpacity = "0.5")}
          />
        ))}
      </svg>
    </div>
  );
};

export default FloorPlan;
