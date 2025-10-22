// ReservationModal.jsx
import React, { useMemo } from "react";
import { Modal, Select, Tag, Alert, Space, Typography } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const ReservationModal = ({
  room,
  selectedType,
  onTypeChange,
  onClose,
  onReserve,
  computeRange,
  getConflictingReservationsForRange,
  isAuthenticated,
}) => {
  // eslint-disable-next-line no-unused-vars
  const range = useMemo(() => (room ? computeRange(selectedType, dayjs()) : null), [room, selectedType, computeRange]);

  // Note: computeRange here expects a selected date; we'll get the actual date from parent component (KiselaVoda)
  // But ReservationModal is opened when a room is clicked after selecting a date, parent passes selectedDate implicitly via computeRange usage.
  // To compute the accurate range we will expect parent to call computeRange with the currently selected date — in the KiselaVoda implementation we call computeRange(selectedType, selectedDate) when opening.
  // For safety, get conflicting reservations via provided function if room exists
  const conflicts = room ? getConflictingReservationsForRange(room.id, computeRange(selectedType, dayjs(room?.selectedDate || undefined))) : [];

  // To avoid complexity: parent will compute real range and will pass getConflictingReservationsForRange which expects {start,end}.

  // Determine whether reserve button should be disabled:
  const hasConflict = conflicts && conflicts.length > 0;
  const disabled = !room || hasConflict || !isAuthenticated;

  // We'll display a simple computed start/end using computeRange when passed a valid selectedDate — parent passes computeRange from KiselaVoda and we call with the real selectedDate by reading it from the room object if present.
  // But to keep modal independent, we receive and display the computed range via computeRange(selectedType, room?.selectedDate) if parent set room.selectedDate.
  const displayRange = room?.selectedDate
    ? computeRange(selectedType, room.selectedDate)
    : // fallback: show placeholder
      null;

  return (
    <Modal
      title={room ? `Reserve ${room.name}` : "Reserve"}
      open={!!room}
      onCancel={onClose}
      onOk={onReserve}
      okButtonProps={{ disabled }}
      okText={isAuthenticated ? "Reserve" : "Log in to Reserve"}
      destroyOnHidden
    >
      {!isAuthenticated && (
        <Alert type="warning" message="You must be logged in to make a reservation." style={{ marginBottom: 10 }} />
      )}

      <div style={{ marginBottom: 10 }}>
        <Text strong>Booking type:</Text>
        <Select
          value={selectedType}
          onChange={onTypeChange}
          style={{ width: "100%", marginTop: 8 }}
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly (7 days from selected date)" },
            { value: "monthly", label: "Monthly (entire month)" },
          ]}
        />
      </div>

      {displayRange && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Range:</Text>
          <div style={{ marginTop: 6 }}>
            <Tag>{displayRange.start}</Tag> <Text>to</Text> <Tag>{displayRange.end}</Tag>
          </div>
        </div>
      )}

      {room?.bookedRanges?.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Existing bookings for this room:</Text>
          <Space direction="vertical" style={{ marginTop: 6 }}>
            {room.bookedRanges.map((b, i) => (
              <div key={i}>
                <Tag>{b.start}</Tag> <Text>to</Text> <Tag>{b.end}</Tag> <Text>({b.type})</Text>
              </div>
            ))}
          </Space>
        </div>
      )}

      {hasConflict && (
        <Alert
          message="This room has a conflicting reservation during the selected range."
          type="error"
          showIcon
          style={{ marginTop: 10 }}
        />
      )}

      {!room && <Alert message="Select a room from the floorplan to reserve." type="info" style={{ marginTop: 10 }} />}
    </Modal>
  );
};

export default React.memo(ReservationModal);
