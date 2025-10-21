import { DatePicker, Select, Button, Alert, Tag } from "antd";
import BookingOverview from "./BookingOverview";


const ControlPanel = ({
  selectedDate,
  setSelectedDate,
  activeOfficeId,
  setActiveOfficeId,
  offices,
  showOverview,
  setShowOverview,
  seatsWithStatus,
  reservations,
  activeOffice,
}) => {
  // Helper to determine color for a date
  const getDateColor = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    const reservationsForDate = reservations.filter(
      (r) => r.date === dateStr && r.officeId === activeOffice.id
    );
    const bookedSeats = new Set(reservationsForDate.map((r) => r.seatId));
    const totalSeats = activeOffice.seats.length;

    if (bookedSeats.size === 0) return "#d9f7be"; // green
    if (bookedSeats.size < totalSeats) return "#fff566"; // yellow
    return "#ffa39e"; // red
  };

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <DatePicker
          value={selectedDate}
          onChange={(d) => setSelectedDate(d)}
          style={{ width: 250 }}
          allowClear={false}
          placeholder="Select date"
          dateRender={(current) => {
            const style = {
              borderRadius: "50%",
              width: 32,
              height: 32,
              lineHeight: "32px",
              textAlign: "center",
              backgroundColor: getDateColor(current),
            };
            return <div className="ant-picker-cell-inner" style={style}>{current.date()}</div>;
          }}
        />
        <Select
          value={activeOfficeId}
          onChange={setActiveOfficeId}
          style={{ width: 200 }}
          options={offices.map((o) => ({ value: o.id, label: o.name }))}
        />
        <button
          onClick={() => setShowOverview((prev) => !prev)}
          className="landing-btn text-white px-5 py-2 rounded-full raleway-300 transition duration-300"
        >
          {showOverview ? "Hide Overview" : "Show Overview"}
        </button>
      </div>

      {selectedDate && (
        <Alert
          style={{ marginBottom: 20 }}
          message={
            <>
              Selected Date: {selectedDate.format("YYYY-MM-DD")}
              <Tag color="blue" style={{ marginLeft: 10 }}>
                {seatsWithStatus.filter((r) => r.status === "free").length} free
              </Tag>
              <Tag color="red" style={{ marginLeft: 5 }}>
                {seatsWithStatus.filter((r) => r.status === "taken").length} booked
              </Tag>
            </>
          }
          type="info"
          showIcon
        />
      )}

      {showOverview && (
        <BookingOverview
          reservations={reservations.filter((r) => r.officeId === activeOffice.id)}
        />
      )}
    </div>
  );
};

export default ControlPanel;
