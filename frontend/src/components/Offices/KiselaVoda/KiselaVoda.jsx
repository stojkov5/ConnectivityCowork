// KiselaVoda.jsx
import React, { useState, useMemo, useCallback } from "react";
import { Row, Col, DatePicker, Alert, Tag, message } from "antd";
import dayjs from "dayjs";
import BookingOverview from "./BookingOverview";
import FloorPlan from "./FloorPlan";
import ReservationModal from "./ReservationModal";
import PhotoSlider from "../../PhotoSlider";
// import TypeOfBooking from "./TypeOfBooking";
// ===== Constants =====
const initialRooms = [
  { id: "room-1", name: "Room 1" },
  { id: "room-2", name: "Room 2" },
  { id: "room-3", name: "Room 3" },
  { id: "room-4", name: "Room 4" },
  { id: "room-5", name: "Room 5" },
  { id: "room-6", name: "Room 6" },
  { id: "room-7", name: "Room 7" },
  { id: "room-8", name: "Room 8" },
];

// ===== Helpers =====
const normalizeDate = (d) => dayjs(d).format("YYYY-MM-DD");

// return range inclusive { start, end } as YYYY-MM-DD strings
const computeRange = (type, selectedDate) => {
  if (!selectedDate) return null;
  const d = dayjs(selectedDate);
  if (type === "daily") {
    const s = d.startOf("day");
    return { start: normalizeDate(s), end: normalizeDate(s) };
  }
  if (type === "weekly") {
    const s = d.startOf("day");
    const e = s.add(6, "day"); // 7-day window starting at selected date
    return { start: normalizeDate(s), end: normalizeDate(e) };
  }
  if (type === "monthly") {
    const s = d.startOf("month");
    const e = d.endOf("month");
    return { start: normalizeDate(s), end: normalizeDate(e) };
  }
  return null;
};

// check overlap between two inclusive ranges a/b (strings YYYY-MM-DD)
const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return !(
    dayjs(aEnd).isBefore(dayjs(bStart)) || dayjs(aStart).isAfter(dayjs(bEnd))
  );
};

// ===== Custom Hook (simple localStorage-based) =====
function useReservations() {
  const getAll = () => JSON.parse(localStorage.getItem("reservations") || "[]");

  const reservations = getAll();

  const saveReservations = (newArr) => {
    localStorage.setItem("reservations", JSON.stringify(newArr));
    return newArr;
  };

  const addReservation = (newRes) => {
    const latest = getAll();
    const merged = [...latest, newRes];
    saveReservations(merged);
    return merged;
  };

  return { reservations, addReservation };
}

// ===== Main Component =====
const KiselaVoda = ({ isLoggedInProp = null }) => {
  const { reservations, addReservation } = useReservations();

  // default auth: check localStorage token (you can pass isLoggedInProp from your auth context)
  const isAuthenticated =
    typeof isLoggedInProp === "boolean"
      ? isLoggedInProp
      : !!localStorage.getItem("token");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedType, setSelectedType] = useState("daily");
  const [showOverview, setShowOverview] = useState(false);

  // --- Compute rooms from reservations & selectedDate (determine if room is free/taken on that date) ---
  const rooms = useMemo(() => {
    if (!selectedDate)
      return initialRooms.map((r) => ({
        ...r,
        status: "free",
        bookedRanges: [],
      }));
    const formatted = selectedDate.format("YYYY-MM-DD");
    return initialRooms.map((room) => {
      const booked = reservations.filter(
        (r) =>
          r.roomId === room.id &&
          rangesOverlap(r.startDate, r.endDate, formatted, formatted)
      );
      // If any reservation overlaps the selected date -> taken
      return {
        ...room,
        status: booked.length > 0 ? "taken" : "free",
        bookedRanges: reservations
          .filter((r) => r.roomId === room.id)
          .map((r) => ({ start: r.startDate, end: r.endDate, type: r.type })),
      };
    });
  }, [selectedDate, reservations]);

  const getConflictingReservationsForRange = useCallback(
    (roomId, range) => {
      if (!range) return [];
      return reservations.filter(
        (r) =>
          r.roomId === roomId &&
          rangesOverlap(r.startDate, r.endDate, range.start, range.end)
      );
    },
    [reservations]
  );

  const handleReserve = useCallback(() => {
    if (!isAuthenticated) {
      message.error("You must be logged in to reserve.");
      return;
    }
    if (!selectedRoom || !selectedDate || !selectedType) return;

    const range = computeRange(selectedType, selectedDate);
    if (!range) return;

    // check overlap
    const conflicts = getConflictingReservationsForRange(
      selectedRoom.id,
      range
    );
    if (conflicts.length > 0) {
      message.error("This room is already booked for (part of) that range.");
      return;
    }

    // create reservation record
    const newRes = {
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      type: selectedType,
      startDate: range.start,
      endDate: range.end,
      createdAt: new Date().toISOString(),
      // Optional: userId: ... (if available from auth)
    };

    addReservation(newRes);
    message.success("Reservation created.");
    // reset modal selection
    setSelectedRoom(null);
    setSelectedType("daily");
  }, [
    isAuthenticated,
    selectedRoom,
    selectedDate,
    selectedType,
    addReservation,
    getConflictingReservationsForRange,
  ]);

  const dateRender = useCallback(
    (current) => {
      const formatted = current.format("YYYY-MM-DD");
      const allTaken = initialRooms.every((room) =>
        reservations.some(
          (r) =>
            r.roomId === room.id &&
            rangesOverlap(r.startDate, r.endDate, formatted, formatted)
        )
      );
      const partiallyTaken =
        !allTaken &&
        reservations.some((r) =>
          rangesOverlap(r.startDate, r.endDate, formatted, formatted)
        );

      const base = {
        borderRadius: "50%",
        width: 24,
        height: 24,
        textAlign: "center",
        margin: "auto",
        lineHeight: "22px",
      };

      if (allTaken)
        return (
          <div style={{ ...base, background: "#ff4d4f", color: "#fff" }}>
            {current.date()}
          </div>
        );
      if (partiallyTaken)
        return (
          <div
            style={{ ...base, border: "1px solid #faad14", color: "#faad14" }}
          >
            {current.date()}
          </div>
        );
      return <div style={base}>{current.date()}</div>;
    },
    [reservations]
  );

  return (
    <Row justify="center" className="py-20">
      <Col span={20}>
        <div className="kiselavoda-wrapper" style={{ margin: "3rem auto" }}>
          <h2 className="text-center text-3xl raleway-600 mb-6">KISELA VODA</h2>
          <PhotoSlider />
          {/* <TypeOfBooking/> */}
          <Row gutter={[16, 16]} className="my-5">
            {/* LEFT SIDE */}
            <Col xs={24} md={6}>
              <div
                style={{
                  marginBottom: 20,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <DatePicker
                  value={selectedDate}
                  onChange={(d) => {
                    setSelectedDate(d);
                    setSelectedRoom(null);
                    setSelectedType("daily");
                  }}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  cellRender={dateRender}
                  style={{ width: 250 }}
                  allowClear={false}
                  placeholder="Select date"
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
                      {selectedDate.format("YYYY-MM-DD")}
                      <Tag color="blue" style={{ marginLeft: 10 }}>
                        {rooms.filter((r) => r.status === "free").length} free
                      </Tag>
                      <Tag color="red" style={{ marginLeft: 5 }}>
                        {rooms.filter((r) => r.status === "taken").length}{" "}
                        booked
                      </Tag>
                    </>
                  }
                  type="info"
                  showIcon
                />
              )}

              {showOverview && (
                <BookingOverview
                  reservations={reservations}
                  rooms={initialRooms}
                />
              )}
            </Col>

            {/* RIGHT SIDE / SVG */}
            <Col xs={24} md={18}>
              <FloorPlan
                rooms={rooms}
                selectedDate={selectedDate}
                onRoomClick={setSelectedRoom}
              />
            </Col>
          </Row>

          {/* MODAL */}
          <ReservationModal
            room={selectedRoom}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            onClose={() => {
              setSelectedRoom(null);
              setSelectedType("daily");
            }}
            onReserve={handleReserve}
            computeRange={computeRange}
            getConflictingReservationsForRange={
              getConflictingReservationsForRange
            }
            isAuthenticated={isAuthenticated}
          />
        </div>
      </Col>
    </Row>
  );
};

export default KiselaVoda;
