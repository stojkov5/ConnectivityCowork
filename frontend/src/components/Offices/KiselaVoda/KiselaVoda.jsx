import React, { useState, useMemo, useCallback } from "react";
import { Row, Col, DatePicker, Alert, Tag, message } from "antd";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import BookingOverview from "./BookingOverview";
import FloorPlan from "./FloorPlan";
import ReservationModal from "./ReservationModal";
import { useAuth } from "../../../context/AuthContext.jsx";

import "../../../styles/KiselaVoda.css";

const API_URL = import.meta.env.VITE_API_URL;

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

const normalizeDate = (d) => dayjs(d).format("YYYY-MM-DD");

const computeRange = (type, selectedDate) => {
  if (!selectedDate) return null;
  const d = dayjs(selectedDate);

  if (type === "daily") {
    return { start: normalizeDate(d), end: normalizeDate(d) };
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

const rangesOverlap = (aStart, aEnd, bStart, bEnd) =>
  !(
    dayjs(aEnd).isBefore(dayjs(bStart)) || dayjs(aStart).isAfter(dayjs(bEnd))
  );

const KiselaVoda = ({ isLoggedInProp = null }) => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const isAuthenticated =
    typeof isLoggedInProp === "boolean" ? isLoggedInProp : !!token;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedType, setSelectedType] = useState("daily");
  const [showOverview, setShowOverview] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // Fetch reservations from backend
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

  // Create reservation mutation
  const createReservation = useMutation({
    mutationFn: async ({ roomId, plan, startDate, companyName }) => {
      return axios.post(
        `${API_URL}/api/reservations`,
        {
          location: "kiselavoda",
          officeId: "kiselavoda",
          resourceType: "room",
          resourceIds: [roomId],
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
      message.success("Reservation created.");
      queryClient.invalidateQueries(["reservations", "kiselavoda"]);
      setSelectedRoom(null);
      setSelectedType("daily");
      setCompanyName("");
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        "Failed to create reservation. Possibly a conflict.";
      message.error(msg);
    },
  });

  // Derive rooms with status based on reservations
  const rooms = useMemo(() => {
    if (!selectedDate) {
      return initialRooms.map((r) => ({
        ...r,
        status: "free",
        bookedRanges: [],
      }));
    }

    const formatted = selectedDate.format("YYYY-MM-DD");

    return initialRooms.map((room) => {
      const booked = reservations.filter(
        (r) =>
          r.roomId === room.id &&
          rangesOverlap(r.startDate, r.endDate, formatted, formatted)
      );

      return {
        ...room,
        status: booked.length > 0 ? "taken" : "free",
        bookedRanges: reservations
          .filter((r) => r.roomId === room.id)
          .map((r) => ({
            start: r.startDate,
            end: r.endDate,
            type: r.type,
          })),
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

  const handleReserve = useCallback(
    ({ room, type, companyName, range }) => {
      if (!isAuthenticated) {
        message.error("You must be logged in to reserve.");
        return;
      }
      if (!room || !selectedDate || !type || !range) return;

      const conflicts = getConflictingReservationsForRange(room.id, range);
      if (conflicts.length > 0) {
        message.error("This room is already booked for (part of) that range.");
        return;
      }

      createReservation.mutate({
        roomId: room.id,
        plan: type,
        startDate: range.start,
        companyName,
      });
    },
    [
      isAuthenticated,
      selectedDate,
      getConflictingReservationsForRange,
      createReservation,
    ]
  );

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

      if (allTaken) {
        return (
          <div className="calendar-dot bg-red-500 text-white">
            {current.date()}
          </div>
        );
      }
      if (partiallyTaken) {
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
    [reservations]
  );

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
                <div className="bg-white rounded-xl shadow-md p-5 space-y-5 card-hover flex flex-col  gap-5">
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
                    className="w-full"
                    allowClear={false}
                    placeholder="Select a date"
                  />

                  <button
                    onClick={() => setShowOverview((prev) => !prev)}
                    className="w-full bg-orange-500 text-white rounded-md py-2 font-medium hover:bg-orange-600 transition duration-300 "
                  >
                    {showOverview ? "Hide Overview" : "Show Overview"}
                  </button>

                  {selectedDate && (
                    <Alert
                      className="rounded-md p-0"
                      message={
                        <>
                          {selectedDate.format("YYYY-MM-DD")}
                          <Tag color="blue" className="ml-2">
                            {rooms.filter((r) => r.status === "free").length}{" "}
                            free
                          </Tag>
                          <Tag color="red" className="ml-2">
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
                    <div className="max-h-[480px] overflow-y-auto border-t ">
                      <BookingOverview
                        reservations={reservations}
                        rooms={initialRooms}
                      />
                    </div>
                  )}
                </div>
              </Col>

              {/* RIGHT PANEL */}
              <Col xs={24} md={18}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <FloorPlan
                    rooms={rooms}
                    selectedDate={selectedDate}
                    onRoomClick={(room) =>
                      setSelectedRoom({ ...room, selectedDate })
                    }
                  />
                </div>
              </Col>
            </Row>

            <ReservationModal
              room={selectedRoom}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              onClose={() => {
                setSelectedRoom(null);
                setSelectedType("daily");
                setCompanyName("");
              }}
              onReserve={handleReserve}
              computeRange={computeRange}
              getConflictingReservationsForRange={
                getConflictingReservationsForRange
              }
              isAuthenticated={isAuthenticated}
              userEmail={user?.email}
              companyName={companyName}
              onCompanyNameChange={setCompanyName}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default KiselaVoda;
