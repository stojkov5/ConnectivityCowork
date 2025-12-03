import React, { useState, useMemo, useCallback } from "react";
import {
  Row,
  Col,
  DatePicker,
  Alert,
  Tag,
  message,
  Select,
  Button,
} from "antd";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import BookingOverview from "./BookingOverview";
import FloorPlan from "./FloorPlan";
import ReservationModal from "./ReservationModal";
import { useAuth } from "../../../context/AuthContext.jsx";

import "../../../styles/Centar.css";

// === offices data ===
const offices = [
  {
    id: "centar",
    name: "Centar - First Floor",
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
    name: "Centar - Gallery",
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

const API_URL = import.meta.env.VITE_API_URL;

const normalizeDate = (d) => dayjs(d).format("YYYY-MM-DD");

const computeRange = (plan, selectedDate) => {
  if (!selectedDate) return null;
  const d = dayjs(selectedDate);

  if (plan === "daily") {
    return { start: normalizeDate(d), end: normalizeDate(d) };
  }
  if (plan === "weekly") {
    const s = d.startOf("day");
    const e = s.add(6, "day");
    return { start: normalizeDate(s), end: normalizeDate(e) };
  }
  if (plan === "monthly") {
    const s = d.startOf("month");
    const e = d.endOf("month");
    return { start: normalizeDate(s), end: normalizeDate(e) };
  }
  return null;
};

const rangesOverlap = (aStart, aEnd, bStart, bEnd) =>
  !(
    dayjs(aEnd).isBefore(dayjs(bStart)) ||
    dayjs(aStart).isAfter(dayjs(bEnd))
  );

const Center = ({ isLoggedInProp = null }) => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const isAuthenticated =
    typeof isLoggedInProp === "boolean" ? isLoggedInProp : !!token;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [showOverview, setShowOverview] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOfficeId, setActiveOfficeId] = useState("centar");

  const activeOffice = useMemo(
    () => offices.find((o) => o.id === activeOfficeId),
    [activeOfficeId]
  );

  // === load reservations for this office from backend ===
  const { data: reservations = [] } = useQuery({
    queryKey: ["reservations", "centar", activeOfficeId],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/reservations`, {
        params: {
          location: "centar",
          officeId: activeOfficeId,
        },
      });

      return res.data.reservations.map((r) => ({
        ...r,
        seatId: r.resourceId,
        seatName: r.resourceName,
        type: r.plan,
        startDate: dayjs(r.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(r.endDate).format("YYYY-MM-DD"),
      }));
    },
  });

  // === mutation for creating reservation (email-verified on backend) ===
  const createReservation = useMutation({
    mutationFn: async ({ seatIds, plan, startDate, companyName }) => {
      return axios.post(
        `${API_URL}/api/reservations`,
        {
          location: "centar",
          officeId: activeOfficeId,
          resourceType: "seat",
          resourceIds: seatIds,
          plan,
          startDate,
          companyName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      message.success(
        "Reservation request sent. Please confirm it from your email."
      );
      queryClient.invalidateQueries(["reservations", "centar", activeOfficeId]);
      setSelectedSeatIds([]);
      setSelectedPlan(null);
      setCompanyName("");
      setModalOpen(false);
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        "Failed to create reservation. Possibly a conflict.";
      message.error(msg);
    },
  });

  // range for current date + plan
  const range =
    selectedDate && selectedPlan
      ? computeRange(selectedPlan, selectedDate)
      : null;

  const getConflictingReservationsForRange = useCallback(
    (seatId, rangeObj) => {
      if (!rangeObj) return [];
      return reservations.filter(
        (r) =>
          r.seatId === seatId &&
          rangesOverlap(r.startDate, r.endDate, rangeObj.start, rangeObj.end)
      );
    },
    [reservations]
  );

  // === derive seats with status (disabled / free / selected / taken) ===
  const seatsWithStatus = useMemo(() => {
    if (!activeOffice) return [];

    // Before date+plan => everything greyed out (disabled)
    if (!selectedDate || !selectedPlan) {
      return activeOffice.seats.map((seat) => ({
        ...seat,
        status: "disabled",
        bookedRanges: reservations
          .filter((r) => r.seatId === seat.id)
          .map((r) => ({
            start: r.startDate,
            end: r.endDate,
            type: r.type,
          })),
      }));
    }

    // With date+plan => check for overlap conflicts
    return activeOffice.seats.map((seat) => {
      const conflicts = getConflictingReservationsForRange(seat.id, range);

      let status;
      if (conflicts.length > 0) {
        status = "taken"; // red, not clickable
      } else if (selectedSeatIds.includes(seat.id)) {
        status = "selected"; // yellow
      } else {
        status = "free"; // green
      }

      return {
        ...seat,
        status,
        bookedRanges: reservations
          .filter((r) => r.seatId === seat.id)
          .map((r) => ({
            start: r.startDate,
            end: r.endDate,
            type: r.type,
          })),
      };
    });
  }, [
    activeOffice,
    reservations,
    selectedDate,
    selectedPlan,
    range,
    selectedSeatIds,
    getConflictingReservationsForRange,
  ]);

  const selectedSeats = useMemo(
    () =>
      activeOffice
        ? activeOffice.seats.filter((s) => selectedSeatIds.includes(s.id))
        : [],
    [activeOffice, selectedSeatIds]
  );

  // collect conflict details for selected seats
  const conflictDetails = useMemo(() => {
    if (!range) return [];
    const list = [];
    for (const seatId of selectedSeatIds) {
      const seat = activeOffice?.seats.find((s) => s.id === seatId);
      const conflicts = getConflictingReservationsForRange(seatId, range);
      if (conflicts.length > 0) {
        list.push({
          id: seatId,
          name: seat?.name || seatId,
          reservations: conflicts.map((r) => ({
            startDate: r.startDate,
            endDate: r.endDate,
            type: r.type,
          })),
        });
      }
    }
    return list;
  }, [
    selectedSeatIds,
    range,
    activeOffice,
    getConflictingReservationsForRange,
  ]);

  const hasConflicts = conflictDetails.length > 0;

  const handleSeatClick = (seat) => {
    if (!selectedDate || !selectedPlan) {
      message.error("Select a date and plan first");
      return;
    }
    if (seat.status === "taken" || seat.status === "disabled") return;

    setSelectedSeatIds((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id]
    );
  };

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      message.error("You must be logged in to reserve.");
      return;
    }
    if (!selectedDate) {
      message.error("Select a date first.");
      return;
    }
    if (!selectedPlan) {
      message.error("Select a plan.");
      return;
    }
    if (selectedSeatIds.length === 0) {
      message.error("Select at least one seat.");
      return;
    }
    if (hasConflicts) {
      message.error(
        "Some selected seats are already booked in that period. Adjust your selection or plan."
      );
      return;
    }
    setModalOpen(true);
  };

  const handleConfirmReserve = () => {
    if (!range) return;
    createReservation.mutate({
      seatIds: selectedSeatIds,
      plan: selectedPlan,
      startDate: range.start,
      companyName,
    });
  };

  // calendar color highlighting
  const dateRender = useCallback(
    (current) => {
      const formatted = current.format("YYYY-MM-DD");

      const reservationsForDay = reservations.filter((r) =>
        rangesOverlap(r.startDate, r.endDate, formatted, formatted)
      );

      const bookedIds = new Set(reservationsForDay.map((r) => r.seatId));
      const totalSeats = activeOffice ? activeOffice.seats.length : 0;

      if (bookedIds.size === totalSeats && totalSeats > 0) {
        return (
          <div className="calendar-dot bg-red-500 text-white">
            {current.date()}
          </div>
        );
      }
      if (bookedIds.size > 0) {
        return (
          <div className="calendar-dot border border-orange-400 text-orange-500 font-semibold">
            {current.date()}
          </div>
        );
      }
      return (
        <div className="calendar-dot text-gray-700">{current.date()}</div>
      );
    },
    [reservations, activeOffice]
  );

  const reserveDisabled =
    !isAuthenticated ||
    !selectedDate ||
    !selectedPlan ||
    selectedSeatIds.length === 0 ||
    hasConflicts;

  return (
    <div className="bg-gray-50 min-h-screen py-16 fade-in">
      <Row justify="center">
        <Col span={20}>
          <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-100">
            <h2 className="text-center text-3xl font-semibold text-orange-500 mb-10 tracking-wide">
              CENTER BOOKINGS
            </h2>

            <Row gutter={[24, 24]}>
              {/* LEFT PANEL */}
              <Col xs={24} md={6}>
                <div className="bg-white rounded-xl shadow-md p-5 space-y-5 card-hover flex flex-col gap-5">
                  <DatePicker
                    value={selectedDate}
                    onChange={(d) => {
                      setSelectedDate(d);
                      setSelectedSeatIds([]);
                      setSelectedPlan(null);
                    }}
                    disabledDate={(c) => c && c < dayjs().startOf("day")}
                    cellRender={dateRender}
                    className="w-full"
                    allowClear={false}
                    placeholder="Select a date"
                  />

                  {/* Plan selector */}
                  <Select
                    value={selectedPlan}
                    onChange={setSelectedPlan}
                    placeholder="Select plan"
                    disabled={!selectedDate}
                    style={{ width: "100%" }}
                    options={[
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                    ]}
                  />

                  {/* Office selector */}
                  <select
                    value={activeOfficeId}
                    onChange={(e) => {
                      setActiveOfficeId(e.target.value);
                      setSelectedSeatIds([]);
                    }}
                    className="w-full border rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-orange-500"
                  >
                    {offices.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>

                  {/* Reserve button */}
                  <button
                    className="w-full bg-orange-500 text-white rounded-md py-2.5 font-medium hover:bg-orange-600 transition duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={reserveDisabled}
                    onClick={handleOpenModal}
                  >
                    Reserve
                  </button>

                  {/* Conflict alert */}
                  {hasConflicts && range && (
                    <Alert
                      type="error"
                      showIcon
                      className="rounded-md"
                      message="Some selected seats are already booked in this period. Change your selection or plan."
                    />
                  )}

                  {selectedDate && (
                    <Alert
                      className="rounded-md"
                      message={
                        <>
                          {selectedDate.format("YYYY-MM-DD")}
                          <Tag color="blue" className="ml-2">
                            {
                              seatsWithStatus.filter(
                                (x) => x.status === "free"
                              ).length
                            }{" "}
                            free
                          </Tag>
                          <Tag color="gold" className="ml-2">
                            {
                              seatsWithStatus.filter(
                                (x) => x.status === "selected"
                              ).length
                            }{" "}
                            selected
                          </Tag>
                          <Tag color="red" className="ml-2">
                            {
                              seatsWithStatus.filter(
                                (x) => x.status === "taken"
                              ).length
                            }{" "}
                            booked
                          </Tag>
                        </>
                      }
                      type="info"
                      showIcon
                    />
                  )}

                  <button
                    onClick={() => setShowOverview((prev) => !prev)}
                    className="w-full bg-orange-500 text-white rounded-md py-2.5 font-medium hover:bg-orange-600 transition duration-300 shadow-sm"
                  >
                    {showOverview ? "Hide Overview" : "Show Overview"}
                  </button>

                  {showOverview && (
                    <div className="max-h-[480px] overflow-y-auto border-t pt-3">
                      <BookingOverview
                        reservations={reservations}
                        seats={activeOffice?.seats || []}
                        showDelete={false}
                      />
                    </div>
                  )}
                </div>
              </Col>

              {/* RIGHT PANEL */}
              <Col xs={24} md={18}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <FloorPlan
                    office={activeOffice}
                    seats={seatsWithStatus}
                    onSeatClick={handleSeatClick}
                    statusColors={{
                      disabled: "#d1d5db",
                      free: "#4ade80",
                      selected: "#facc15",
                      taken: "#ef4444",
                    }}
                  />
                </div>
              </Col>
            </Row>

            {/* Summary / email verification modal */}
            <ReservationModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              range={range}
              plan={selectedPlan}
              selectedSeats={selectedSeats}
              userEmail={user?.email}
              companyName={companyName}
              onCompanyNameChange={setCompanyName}
              hasConflicts={hasConflicts}
              conflictDetails={conflictDetails}
              onConfirm={handleConfirmReserve}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Center;
