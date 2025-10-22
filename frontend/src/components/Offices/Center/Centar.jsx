// Center.jsx
import React, { useState, useMemo, useCallback } from "react";
import { Row, Col, DatePicker, Alert, Tag, message } from "antd";
import dayjs from "dayjs";
import BookingOverview from "./BookingOverview";
import FloorPlan from "./FloorPlan";
import ReservationModal from "./ReservationModal";

// === offices data (kept from your file) ===
const offices = [
  {
    id: "centar",
    name: "Centar-First Floor",
    image: "/Centar.svg",
    viewBox: "0 0 893 588",
    seats: [
      { id: "seat-1", name: "Seat 1" },
      { id: "seat-2", name: "Seat 2" },
      { id: "seat-3", name: "Seat 3" },
      { id: "seat-4", name: "Seat 4" },
      { id: "seat-5", name: "Seat 5" },
      { id: "seat-6", name: "Seat 6" },
    ],
    getPathD: (id) =>
      ({
        "seat-1":
          "M476.802 181.96C472.759 158.373 482.98 144.613 488.596 140.682C502.749 142.03 518.642 146.86 524.82 149.106C516.396 150.791 508.814 189.542 513.026 192.911C516.396 195.607 490.281 186.734 476.802 181.96Z",
        "seat-2":
          "M526.15 281.438C503.844 272.768 497.305 256.924 496.824 250.086C505.262 238.644 517.582 227.502 522.687 223.36C519.797 231.451 549.122 257.891 554.179 256.013C558.224 254.511 537.178 272.337 526.15 281.438Z",
        "seat-3":
          "M637.168 289.143C618.217 303.757 601.273 301.164 595.171 298.041C589.738 284.904 586.567 268.598 585.661 262.087C591.093 268.743 628.886 257.306 629.892 252.007C630.697 247.767 635.078 274.998 637.168 289.143Z",
        "seat-4":
          "M699.579 196.062C704.029 219.576 694.047 233.51 688.5 237.538C674.327 236.435 658.352 231.88 652.136 229.741C660.53 227.911 667.441 189.035 663.171 185.739C659.755 183.102 686.02 191.522 699.579 196.062Z",
        "seat-5":
          "M649.753 96.0498C671.991 104.89 678.408 120.784 678.837 127.626C670.312 139.002 657.907 150.05 652.771 154.152C655.723 146.085 626.6 119.42 621.529 121.259C617.473 122.73 638.654 105.066 649.753 96.0498Z",
        "seat-6":
          "M539.379 89.0455C557.691 73.638 574.729 75.5063 580.96 78.3663C586.947 91.2603 590.81 107.416 591.993 113.882C586.282 107.464 549.011 120.501 548.232 125.838C547.608 130.108 542.07 103.089 539.379 89.0455Z",
      }[id] || ""),
  },
  {
    id: "centar2",
    name: "Centar-Gallery",
    image: "/Centar2.svg",
    viewBox: "0 0 860 564",
    seats: [
      { id: "seat-1", name: "Seat 1" },
      { id: "seat-2", name: "Seat 2" },
      { id: "seat-3", name: "Seat 3" },
      { id: "seat-4", name: "Seat 4" },
      { id: "seat-5", name: "Seat 5" },
      { id: "seat-6", name: "Seat 6" },
    ],
    getPathD: (id) =>
      ({
        "seat-1":
          "M103 283V264H147.5V295C146.3 300.2 137 303.5 132.5 304.5H119C114.333 303.167 104.8 299.4 104 295C103.2 290.6 103 285.167 103 283Z",
        "seat-2":
          "M172 283V264H216.5V295C215.3 300.2 206 303.5 201.5 304.5H188C183.333 303.167 173.8 299.4 173 295C172.2 290.6 172 285.167 172 283Z",
        "seat-3":
          "M240 283V264H284.5V295C283.3 300.2 274 303.5 269.5 304.5H256C251.333 303.167 241.8 299.4 241 295C240.2 290.6 240 285.167 240 283Z",
        "seat-4":
          "M284.5 133.5L284.5 152.5L240 152.5L240 121.5C241.2 116.3 250.5 113 255 112L268.5 112C273.167 113.333 282.7 117.1 283.5 121.5C284.3 125.9 284.5 131.333 284.5 133.5Z",
        "seat-5":
          "M216.5 133.5L216.5 152.5L172 152.5L172 121.5C173.2 116.3 182.5 113 187 112L200.5 112C205.167 113.333 214.7 117.1 215.5 121.5C216.3 125.9 216.5 131.333 216.5 133.5Z",
        "seat-6":
          "M148.5 133.5L148.5 152.5L104 152.5L104 121.5C105.2 116.3 114.5 113 119 112L132.5 112C137.167 113.333 146.7 117.1 147.5 121.5C148.3 125.9 148.5 131.333 148.5 133.5Z",
      }[id] || ""),
  },
];

// === helpers ===
const normalizeDate = (d) => dayjs(d).format("YYYY-MM-DD");

const computeRange = (type, selectedDate) => {
  if (!selectedDate) return null;
  const d = dayjs(selectedDate);
  if (type === "daily") {
    const s = d.startOf("day");
    return { start: normalizeDate(s), end: normalizeDate(s) };
  }
  if (type === "weekly") {
    const s = d.startOf("day");
    const e = s.add(6, "day");
    return { start: normalizeDate(s), end: normalizeDate(e) };
  }
  if (type === "monthly") {
    const s = d.startOf("month");
    const e = d.endOf("month");
    return { start: normalizeDate(s), end: normalizeDate(e) };
  }
  return null;
};

const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return !(dayjs(aEnd).isBefore(dayjs(bStart)) || dayjs(aStart).isAfter(dayjs(bEnd)));
};

// === localStorage hook ===
function useReservations(key = "centerReservations") {
  const getAll = () => JSON.parse(localStorage.getItem(key) || "[]");
  const reservations = getAll();
  const saveReservations = (arr) => {
    localStorage.setItem(key, JSON.stringify(arr));
    return arr;
  };

  const addReservation = (newRes) => {
    const latest = getAll();
    const merged = [...latest, newRes];
    saveReservations(merged);
    return merged;
  };

  const deleteReservation = (resToDelete) => {
    const latest = getAll();
    const filtered = latest.filter(
      (r) =>
        !(
          r.officeId === resToDelete.officeId &&
          r.seatId === resToDelete.seatId &&
          r.startDate === resToDelete.startDate &&
          r.endDate === resToDelete.endDate &&
          r.type === resToDelete.type
        )
    );
    saveReservations(filtered);
    return filtered;
  };

  return { reservations, addReservation, deleteReservation };
}

const statusColors = { free: "#00ff00", taken: "#ff0000" };

const Center = ({ isLoggedInProp = null }) => {
  const { reservations, addReservation, deleteReservation } = useReservations();

  const isAuthenticated =
    typeof isLoggedInProp === "boolean" ? isLoggedInProp : !!localStorage.getItem("token");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null); // seat object including selectedDate passed in
  const [selectedType, setSelectedType] = useState("daily");
  const [showOverview, setShowOverview] = useState(false);
  const [activeOfficeId, setActiveOfficeId] = useState("centar");

  const activeOffice = useMemo(() => offices.find((o) => o.id === activeOfficeId), [activeOfficeId]);

  const seatsWithStatus = useMemo(() => {
    if (!activeOffice) return [];
    if (!selectedDate)
      return activeOffice.seats.map((s) => ({ ...s, status: "free", bookedRanges: [] }));
    const formatted = selectedDate.format("YYYY-MM-DD");
    return activeOffice.seats.map((seat) => {
      const booked = reservations.filter(
        (r) =>
          r.seatId === seat.id &&
          r.officeId === activeOffice.id &&
          rangesOverlap(r.startDate, r.endDate, formatted, formatted)
      );
      return {
        ...seat,
        status: booked.length > 0 ? "taken" : "free",
        bookedRanges: reservations
          .filter((r) => r.seatId === seat.id && r.officeId === activeOffice.id)
          .map((r) => ({ start: r.startDate, end: r.endDate, type: r.type })),
      };
    });
  }, [activeOffice, selectedDate, reservations]);

  const getConflictingReservationsForRange = useCallback(
    (seatId, range, officeId) => {
      if (!range) return [];
      return reservations.filter(
        (r) => r.seatId === seatId && r.officeId === officeId && rangesOverlap(r.startDate, r.endDate, range.start, range.end)
      );
    },
    [reservations]
  );

  const handleSeatClick = (seat) => {
    if (!selectedDate) {
      message.error("Select a date first");
      return;
    }
    // pass selectedDate into seat object so modal can compute accurate range
    setSelectedSeat({ ...seat, selectedDate });
    setSelectedType("daily");
  };

  const handleReserve = (seat, type) => {
    if (!isAuthenticated) {
      message.error("You must be logged in to reserve.");
      return;
    }
    if (!seat || !selectedDate || !type) return;

    const range = computeRange(type, selectedDate);
    if (!range) return;

    const conflicts = getConflictingReservationsForRange(seat.id, range, activeOffice.id);
    if (conflicts.length > 0) {
      message.error("This seat is already booked for (part of) that range.");
      return;
    }

    const newRes = {
      officeId: activeOffice.id,
      officeName: activeOffice.name,
      seatId: seat.id,
      seatName: seat.name,
      type,
      startDate: range.start,
      endDate: range.end,
      createdAt: new Date().toISOString(),
    };

    addReservation(newRes);
    message.success("Reservation created.");
    setSelectedSeat(null);
    setSelectedType("daily");
  };

  const handleDelete = (res) => {
    deleteReservation(res);
    message.success("Reservation deleted.");
  };

  const dateRender = useCallback(
    (current) => {
      const formatted = current.format("YYYY-MM-DD");
      const reservationsForDate = reservations.filter((r) => r.officeId === activeOffice.id && rangesOverlap(r.startDate, r.endDate, formatted, formatted));
      const bookedSeats = new Set(reservationsForDate.map((r) => r.seatId));
      const totalSeats = activeOffice.seats.length;
      const base = {
        borderRadius: "50%",
        width: 24,
        height: 24,
        textAlign: "center",
        margin: "auto",
        lineHeight: "22px",
      };

      if (bookedSeats.size === totalSeats)
        return <div style={{ ...base, background: "#ff4d4f", color: "#fff" }}>{current.date()}</div>;
      if (bookedSeats.size > 0)
        return <div style={{ ...base, border: "1px solid #faad14", color: "#faad14" }}>{current.date()}</div>;
      return <div style={base}>{current.date()}</div>;
    },
    [reservations, activeOffice]
  );

  return (
    <Row justify="center">
      <Col span={20}>
        <div style={{ margin: "3rem auto" }}>
          <h2 className="text-center text-3xl raleway-600 mb-6">CENTER</h2>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={6}>
              <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
                <DatePicker
                  value={selectedDate}
                  onChange={(d) => {
                    setSelectedDate(d);
                    setSelectedSeat(null);
                    setSelectedType("daily");
                  }}
                  disabledDate={(current) => current && current < dayjs().startOf("day")}
                  callRender={dateRender}
                  style={{ width: 250 }}
                  allowClear={false}
                  placeholder="Select date"
                />

                <select
                  value={activeOfficeId}
                  onChange={(e) => setActiveOfficeId(e.target.value)}
                  style={{ width: 200, padding: "6px 8px" }}
                >
                  {offices.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowOverview((p) => !p)}
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
                  seats={activeOffice.seats}
                  onDelete={handleDelete}
                  showDelete={isAuthenticated}
                />
              )}
            </Col>

            <Col xs={24} md={18}>
              <FloorPlan
                office={activeOffice}
                seats={seatsWithStatus}
                onSeatClick={(s) => handleSeatClick(s)}
                statusColors={statusColors}
              />
            </Col>
          </Row>

          <ReservationModal
            seat={selectedSeat}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            onClose={() => {
              setSelectedSeat(null);
              setSelectedType("daily");
            }}
            onReserve={handleReserve}
            computeRange={computeRange}
            getConflictingReservationsForRange={(seatId, range) => getConflictingReservationsForRange(seatId, range, activeOffice.id)}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </Col>
    </Row>
  );
};

export default Center;
