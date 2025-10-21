import React, { useState, useMemo, useCallback } from "react";
import { Row, Col, DatePicker, Alert, Tag } from "antd";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookingOverview from "./BookingOverview";
import FloorPlan from "./FloorPlan";
import ReservationModal from "./ReservationModal";

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

const timeSlots = ["08:00 - 16:00", "16:00 - 00:00"];

// ===== Custom Hook =====
function useReservations() {
  const queryClient = useQueryClient();

  const { data: reservations = [] } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => JSON.parse(localStorage.getItem("reservations") || "[]"),
  });

  const saveReservations = useCallback(
    (newData) => {
      localStorage.setItem("reservations", JSON.stringify(newData));
      queryClient.setQueryData(["reservations"], newData);
    },
    [queryClient]
  );

  const addReservation = useMutation({
    mutationFn: (newRes) => [...reservations, newRes],
    onSuccess: saveReservations,
  });

  return { reservations, addReservation };
}

// ===== Main Component =====
const KiselaVoda = () => {
  const { reservations, addReservation } = useReservations();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showOverview, setShowOverview] = useState(false);

  // --- Compute rooms from reservations ---
  const rooms = useMemo(() => {
    if (!selectedDate) return initialRooms;
    const formatted = selectedDate.format("YYYY-MM-DD");
    return initialRooms.map((room) => {
      const booked = reservations.filter(
        (r) => r.roomId === room.id && r.date === formatted
      );
      return {
        ...room,
        status: booked.length >= 2 ? "taken" : "free",
        bookedSlots: booked.map((r) => r.slot),
      };
    });
  }, [selectedDate, reservations]);

  const getAvailableSlots = useCallback(
    (room) => {
      if (!room || !selectedDate) return [];
      const formatted = selectedDate.format("YYYY-MM-DD");
      const booked = reservations
        .filter((r) => r.roomId === room.id && r.date === formatted)
        .map((r) => r.slot);
      return timeSlots.filter((slot) => !booked.includes(slot));
    },
    [reservations, selectedDate]
  );

  const handleReserve = useCallback(() => {
    if (!selectedRoom || !selectedSlot || !selectedDate) return;
    addReservation.mutate({
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      date: selectedDate.format("YYYY-MM-DD"),
      slot: selectedSlot,
      createdAt: new Date().toISOString(),
    });
    setSelectedRoom(null);
    setSelectedSlot("");
  }, [selectedRoom, selectedSlot, selectedDate, addReservation]);

  const dateRender = useCallback(
    (current) => {
      const formatted = current.format("YYYY-MM-DD");
      const allTaken = initialRooms.every((room) =>
        reservations.some(
          (r) => r.roomId === room.id && r.date === formatted && r.slot
        )
      );
      const partiallyTaken =
        !allTaken && reservations.some((r) => r.date === formatted);

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
            style={{
              ...base,
              border: "1px solid #faad14",
              color: "#faad14",
            }}
          >
            {current.date()}
          </div>
        );
      return <div style={base}>{current.date()}</div>;
    },
    [reservations]
  );

  return (
    <Row justify="center">
      <Col span={20}>
        <div className="kiselavoda-wrapper" style={{ margin: "3rem auto" }}>
          <h2 className="text-center text-3xl raleway-600 mb-6">KISELA VODA</h2>

          <Row gutter={[24, 24]}>
            {/* LEFT SIDE */}
            <Col xs={24} md={6}>
              <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
                <DatePicker
                  value={selectedDate}
                  onChange={(d) => {
                    setSelectedDate(d);
                    setSelectedRoom(null);
                    setSelectedSlot("");
                  }}
                  disabledDate={(current) => current && current < dayjs().startOf("day")}
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
                        {rooms.filter((r) => r.status === "taken").length} booked
                      </Tag>
                    </>
                  }
                  type="info"
                  showIcon
                />
              )}

              {showOverview && <BookingOverview reservations={reservations} rooms={rooms} />}
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
            slot={selectedSlot}
            onSlotChange={setSelectedSlot}
            onClose={() => {
              setSelectedRoom(null);
              setSelectedSlot("");
            }}
            onReserve={handleReserve}
            getAvailableSlots={getAvailableSlots}
          />
        </div>
      </Col>
    </Row>
  );
};

export default KiselaVoda;
