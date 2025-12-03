import React, { useState, useMemo, useCallback } from "react";
import { Row, Col, DatePicker, Alert, Tag, message, Select } from "antd";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import BookingOverview from "./BookingOverview";
import FloorPlan from "./FloorPlan";
import ReservationModal from "./ReservationModal";
import { useAuth } from "../../../context/AuthContext.jsx";

import { useTranslation } from "react-i18next";
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
  { id: "room-8", name: "Room 8" }
];

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

const KiselaVoda = ({ isLoggedInProp = null }) => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const isAuthenticated =
    typeof isLoggedInProp === "boolean" ? isLoggedInProp : !!token;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [showOverview, setShowOverview] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // === load reservations for KISELA VODA from backend ===
  const { data: reservations = [] } = useQuery({
    queryKey: ["reservations", "kiselavoda"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/reservations`, {
        params: {
          location: "kiselavoda",
          officeId: "kiselavoda"
        }
      });

      return res.data.reservations.map((r) => ({
        ...r,
        roomId: r.resourceId,
        roomName: r.resourceName,
        type: r.plan,
        startDate: dayjs(r.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(r.endDate).format("YYYY-MM-DD")
      }));
    }
  });

  // === mutation for creating reservation (email-verified on backend) ===
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
          companyName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    },
    onSuccess: () => {
      message.success(
        t("reservation.success")
      );
      queryClient.invalidateQueries(["reservations", "kiselavoda"]);
      setSelectedRoomIds([]);
      setSelectedPlan(null);
      setCompanyName("");
      setModalOpen(false);
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || t("reservation.errorGeneric");
      message.error(msg);
    }
  });

  // range for current date + plan
  const range =
    selectedDate && selectedPlan
      ? computeRange(selectedPlan, selectedDate)
      : null;

  const getConflictingReservationsForRange = useCallback(
    (roomId, rangeObj) => {
      if (!rangeObj) return [];
      return reservations.filter(
        (r) =>
          r.roomId === roomId &&
          rangesOverlap(r.startDate, r.endDate, rangeObj.start, rangeObj.end)
      );
    },
    [reservations]
  );

  // === derive rooms with status (disabled / free / selected / taken) ===
  const roomsWithStatus = useMemo(() => {
    // Before date+plan => everything greyed out (disabled)
    if (!selectedDate || !selectedPlan) {
      return initialRooms.map((room) => ({
        ...room,
        status: "disabled",
        bookedRanges: reservations
          .filter((r) => r.roomId === room.id)
          .map((r) => ({
            start: r.startDate,
            end: r.endDate,
            type: r.type
          }))
      }));
    }

    // With date+plan => check for overlap conflicts
    return initialRooms.map((room) => {
      const conflicts = getConflictingReservationsForRange(room.id, range);

      let status;
      if (conflicts.length > 0) {
        status = "taken"; // red, not clickable
      } else if (selectedRoomIds.includes(room.id)) {
        status = "selected"; // yellow
      } else {
        status = "free"; // green
      }

      return {
        ...room,
        status,
        bookedRanges: reservations
          .filter((r) => r.roomId === room.id)
          .map((r) => ({
            start: r.startDate,
            end: r.endDate,
            type: r.type
          }))
      };
    });
  }, [
    reservations,
    selectedDate,
    selectedPlan,
    range,
    selectedRoomIds,
    getConflictingReservationsForRange
  ]);

  const selectedRooms = useMemo(
    () =>
      initialRooms.filter((room) => selectedRoomIds.includes(room.id)),
    [selectedRoomIds]
  );

  // collect conflict details for selected rooms (for modal display)
  const conflictDetails = useMemo(() => {
    if (!range) return [];
    const list = [];
    for (const roomId of selectedRoomIds) {
      const room = initialRooms.find((r) => r.id === roomId);
      const conflicts = getConflictingReservationsForRange(roomId, range);
      if (conflicts.length > 0) {
        list.push({
          id: roomId,
          name: room?.name || roomId,
          reservations: conflicts.map((r) => ({
            startDate: r.startDate,
            endDate: r.endDate,
            type: r.type
          }))
        });
      }
    }
    return list;
  }, [selectedRoomIds, range, getConflictingReservationsForRange]);

  const hasConflicts = conflictDetails.length > 0;

  const handleRoomClick = (room) => {
    if (!selectedDate || !selectedPlan) {
      message.error(t("kiselaVoda.errors.selectDateAndPlan"));
      return;
    }
    if (room.status === "taken" || room.status === "disabled") return;

    setSelectedRoomIds((prev) =>
      prev.includes(room.id)
        ? prev.filter((id) => id !== room.id)
        : [...prev, room.id]
    );
  };

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      message.error(t("kiselaVoda.errors.mustLogin"));
      return;
    }
    if (!selectedDate) {
      message.error(t("kiselaVoda.errors.selectDate"));
      return;
    }
    if (!selectedPlan) {
      message.error(t("kiselaVoda.errors.selectPlan"));
      return;
    }
    if (selectedRoomIds.length === 0) {
      message.error(t("kiselaVoda.errors.selectRoom"));
      return;
    }
    if (hasConflicts) {
      message.error(t("kiselaVoda.errors.hasConflicts"));
      return;
    }
    setModalOpen(true);
  };

  const handleConfirmReserve = () => {
    if (!range) return;
    createReservation.mutate({
      roomIds: selectedRoomIds,
      plan: selectedPlan,
      startDate: range.start,
      companyName
    });
  };

  // calendar color highlighting
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

  const reserveDisabled =
    !isAuthenticated ||
    !selectedDate ||
    !selectedPlan ||
    selectedRoomIds.length === 0 ||
    hasConflicts;

  return (
    <div className="bg-gray-50 min-h-screen py-16 fade-in">
      <Row justify="center">
        <Col span={20}>
          <div className="bg-white shadow-lg rounded-xl p-10 border border-gray-100">
            <h2 className="text-center text-3xl font-semibold text-orange-500 tracking-wide mb-10">
              {t("kiselaVoda.title")}
            </h2>

            <Row gutter={[24, 24]}>
              {/* LEFT PANEL */}
              <Col xs={24} md={6}>
                <div className="bg-white rounded-xl shadow-md p-5 space-y-5 card-hover flex flex-col gap-5">
                  <DatePicker
                    value={selectedDate}
                    onChange={(d) => {
                      setSelectedDate(d);
                      setSelectedRoomIds([]);
                      setSelectedPlan(null);
                    }}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                    cellRender={dateRender}
                    className="w-full"
                    allowClear={false}
                    placeholder={t("kiselaVoda.datePlaceholder")}
                  />

                  {/* Plan selector */}
                  <Select
                    value={selectedPlan}
                    onChange={setSelectedPlan}
                    placeholder={t("kiselaVoda.planPlaceholder")}
                    disabled={!selectedDate}
                    style={{ width: "100%" }}
                    options={[
                      { value: "daily", label: t("kiselaVoda.plans.daily") },
                      { value: "weekly", label: t("kiselaVoda.plans.weekly") },
                      { value: "monthly", label: t("kiselaVoda.plans.monthly") }
                    ]}
                  />

                  {/* Reserve button */}
                  <button
                    className="w-full bg-orange-500 text-white rounded-md py-2.5 font-medium hover:bg-orange-600 transition duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={reserveDisabled}
                    onClick={handleOpenModal}
                  >
                    {t("kiselaVoda.reserveButton")}
                  </button>

                  {/* Conflict alert */}
                  {hasConflicts && range && (
                    <Alert
                      type="error"
                      showIcon
                      className="rounded-md"
                      message={t("kiselaVoda.conflictAlert")}
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
                              roomsWithStatus.filter(
                                (x) => x.status === "free"
                              ).length
                            }{" "}
                            {t("kiselaVoda.status.free")}
                          </Tag>
                          <Tag color="gold" className="ml-2">
                            {
                              roomsWithStatus.filter(
                                (x) => x.status === "selected"
                              ).length
                            }{" "}
                            {t("kiselaVoda.status.selected")}
                          </Tag>
                          <Tag color="red" className="ml-2">
                            {
                              roomsWithStatus.filter(
                                (x) => x.status === "taken"
                              ).length
                            }{" "}
                            {t("kiselaVoda.status.booked")}
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
                    {showOverview
                      ? t("kiselaVoda.overview.hide")
                      : t("kiselaVoda.overview.show")}
                  </button>

                  {showOverview && (
                    <div className="max-h-[480px] overflow-y-auto border-t pt-3">
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
                    rooms={roomsWithStatus}
                    onRoomClick={handleRoomClick}
                    statusColors={{
                      disabled: "#d1d5db",
                      free: "#4ade80",
                      selected: "#facc15",
                      taken: "#ef4444"
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
              selectedRooms={selectedRooms}
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

export default KiselaVoda;
