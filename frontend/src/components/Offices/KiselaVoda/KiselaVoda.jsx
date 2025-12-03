// src/components/Offices/KiselaVoda/KiselaVoda.jsx
import React, { useState, useMemo, useCallback } from "react";
import { Row, Col, DatePicker, Alert, Tag, message, Select, Button } from "antd";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import BookingOverview from "./BookingOverview";
import FloorPlan from "./FloorPlan";
import { useAuth } from "../../../context/AuthContext.jsx";

import "../../../styles/KiselaVoda.css";

const API_URL = import.meta.env.VITE_API_URL;

// === rooms data ===
const rooms = [
  { id: "room-1", name: "Room 1" },
  { id: "room-2", name: "Room 2" },
  { id: "room-3", name: "Room 3" },
  { id: "room-4", name: "Room 4" },
  { id: "room-5", name: "Room 5" },
  { id: "room-6", name: "Room 6" },
  { id: "room-7", name: "Room 7" },
  { id: "room-8", name: "Room 8" },
];

const normalizeDate = (d) => dayjs(d).format("YYYY-MM-DD");

const computeRange = (type, selectedDate) => {
  if (!selectedDate) return null;
  const d = dayjs(selectedDate);

  if (type === "daily") return { start: normalizeDate(d), end: normalizeDate(d) };

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

const rangesOverlap = (aStart, aEnd, bStart, bEnd) =>
  !(
    dayjs(aEnd).isBefore(dayjs(bStart)) ||
    dayjs(aStart).isAfter(dayjs(bEnd))
  );

const KiselaVoda = ({ isLoggedInProp = null }) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const isAuthenticated =
    typeof isLoggedInProp === "boolean" ? isLoggedInProp : !!token;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("daily");
  const [selectedRooms, setSelectedRooms] = useState([]); // multi-select
  const [showOverview, setShowOverview] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // Fetch CONFIRMED reservations for Kisela voda
  const { data: reservations = [] } = useQuery({
    queryKey: ["reservations", "kiselavoda"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/reservations`, {
        params: {
          location: "kiselavoda",
          officeId: "kiselavoda",
        },
      });

      return res.data.reservations.map((r) => ({
        ...r,
        roomId: r.resourceId,
        roomName: r.resourceName,
        type: r.plan,
        startDate: dayjs(r.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(r.endDate).format("YYYY-MM-DD"),
      }));
    },
  });

  // Create reservation request (email verification happens on backend)
  const createReservation = useMutation({
    mutationFn: async ({ roomIds, plan, startDate, companyName }) => {
      return axios.post(
        `${API_URL}/api/reservations`,
        {
          location: "kiselavoda",
          officeId: "kiselavoda",
          resourceType: "room",
          resourceIds: roomIds,
          plan,
          startDate,
          companyName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: (res) => {
      message.success(
        res.data?.message ||
          "Reservation request created. Check your email to confirm."
      );
      queryClient.invalidateQueries(["reservations", "kiselavoda"]);
      setSelectedRooms([]);
      setCompanyName("");
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        "Failed to create reservation request.";
      message.error(msg);
    },
  });

  // derive status per room for the selected day
  const roomsWithStatus = useMemo(() => {
    if (!selectedDate) {
      return rooms.map((room) => ({
        ...room,
        status: "free",
        bookedRanges: [],
      }));
    }

    const formatted = selectedDate.format("YYYY-MM-DD");

    return rooms.map((room) => {
      const booked = reservations.filter(
        (r) =>
          r.roomId === room.id &&
          rangesOverlap(r.startDate, r.endDate, formatted, formatted)
      );

      const isBooked = booked.length > 0;
      const isSelected = selectedRooms.includes(room.id);

      return {
        ...room,
        status: isBooked ? "taken" : isSelected ? "selected" : "free",
        bookedRanges: reservations
          .filter((r) => r.roomId === room.id)
          .map((r) => ({
            start: r.startDate,
            end: r.endDate,
            type: r.type,
          })),
      };
    });
  }, [selectedDate, reservations, selectedRooms]);

  // calendar dot rendering based on room occupancy
  const dateRender = useCallback(
    (current) => {
      const formatted = current.format("YYYY-MM-DD");

      const reservationsForDay = reservations.filter((r) =>
        rangesOverlap(r.startDate, r.endDate, formatted, formatted)
      );

      const bookedIds = new Set(reservationsForDay.map((r) => r.roomId));

      if (bookedIds.size === rooms.length)
        return (
          <div className="calendar-dot bg-red-500 text-white">
            {current.date()}
          </div>
        );

      if (bookedIds.size > 0)
        return (
          <div className="calendar-dot border border-orange-400 text-orange-500 font-semibold">
            {current.date()}
          </div>
        );

      return <div className="calendar-dot text-gray-700">{current.date()}</div>;
    },
    [reservations]
  );

  const handleRoomClick = (room) => {
    if (!selectedDate) {
      return message.error("Select a date first.");
    }
    if (!selectedPlan) {
      return message.error("Select a plan first.");
    }
    if (room.status === "taken") return;

    setSelectedRooms((prev) =>
      prev.includes(room.id)
        ? prev.filter((id) => id !== room.id)
        : [...prev, room.id]
    );
  };

  const handleReserveClick = () => {
    if (!isAuthenticated) {
      message.error("You must be logged in to reserve.");
      return;
    }
    if (!selectedDate) {
      message.error("Select a date first.");
      return;
    }
    if (!selectedPlan) {
      message.error("Select a plan first.");
      return;
    }
    if (selectedRooms.length === 0) {
      message.error("Select at least one room.");
      return;
    }
    if (!companyName.trim()) {
      message.error("Enter company / organization name.");
      return;
    }

    const range = computeRange(selectedPlan, selectedDate);
    if (!range) return;

    // client-side conflict check (confirmed reservations only)
    const conflict = selectedRooms.some((roomId) =>
      reservations.some(
        (r) =>
          r.roomId === roomId &&
          rangesOverlap(r.startDate, r.endDate, range.start, range.end)
      )
    );

    if (conflict) {
      message.error(
        "One or more selected rooms are already booked in that period."
      );
      return;
    }

    createReservation.mutate({
      roomIds: selectedRooms,
      plan: selectedPlan,
      startDate: range.start,
      companyName,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 fade-in">
      <Row justify="center">
        <Col span={20}>
          <div className="bg-white shadow-lg rounded-xl p-10 border border-gray-100">
            <h2 className="text-center text-3xl font-semibold text-orange-500 tracking-wide mb-10">
              KISELA VODA BOOKINGS
            </h2>

            <Row gutter={[24, 24]}>
              {/* LEFT PANEL */}
              <Col xs={24} md={6}>
                <div className="bg-white rounded-xl shadow-md p-5 space-y-4 card-hover flex flex-col gap-4">
                  <DatePicker
                    value={selectedDate}
                    onChange={(d) => {
                      setSelectedDate(d);
                      setSelectedRooms([]);
                    }}
                    disabledDate={(c) => c && c < dayjs().startOf("day")}
                    cellRender={dateRender}
                    className="w-full"
                    allowClear={false}
                    placeholder="Select a date"
                  />

                  <Select
                    value={selectedPlan}
                    onChange={setSelectedPlan}
                    disabled={!selectedDate}
                    className="w-full"
                    options={[
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly (7 days)" },
                      { value: "monthly", label: "Monthly" },
                    ]}
                    placeholder="Select plan"
                  />

                  <input
                    type="text"
                    className="w-full border rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-orange-500"
                    placeholder="Company / Organization"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />

                  <Button
                    type="primary"
                    className="w-full bg-orange-500"
                    onClick={handleReserveClick}
                    disabled={
                      !isAuthenticated ||
                      !selectedDate ||
                      !selectedPlan ||
                      selectedRooms.length === 0 ||
                      !companyName.trim()
                    }
                    loading={createReservation.isLoading}
                  >
                    Reserve (email confirmation)
                  </Button>

                  <button
                    onClick={() => setShowOverview((prev) => !prev)}
                    className="w-full bg-orange-500 text-white rounded-md py-2.5 font-medium hover:bg-orange-600 transition duration-300 shadow-sm"
                  >
                    {showOverview ? "Hide Overview" : "Show Overview"}
                  </button>

                  {selectedDate && (
                    <Alert
                      className="rounded-md"
                      message={
                        <>
                          {selectedDate.format("YYYY-MM-DD")}
                          <Tag color="blue" className="ml-2">
                            {
                              roomsWithStatus.filter((x) => x.status === "free")
                                .length
                            }{" "}
                            free
                          </Tag>
                          <Tag color="gold" className="ml-2">
                            {
                              roomsWithStatus.filter(
                                (x) => x.status === "selected"
                              ).length
                            }{" "}
                            selected
                          </Tag>
                          <Tag color="red" className="ml-2">
                            {
                              roomsWithStatus.filter(
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

                  {showOverview && (
                    <div className="max-h-[480px] overflow-y-auto border-t pt-3">
                      <BookingOverview
                        reservations={reservations}
                        rooms={rooms}
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
                    rooms={roomsWithStatus}
                    onRoomClick={handleRoomClick}
                    statusColors={{
                      free: "#00ff00",
                      taken: "#ff0000",
                      selected: "#ffd400",
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default KiselaVoda;
