// src/components/Offices/KiselaVoda/ReservationModal.jsx
import React, { useMemo } from "react";
import { Modal, Select, Tag, Alert, Space, Typography, Input } from "antd";

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
  userEmail,
  companyName,
  onCompanyNameChange,
}) => {
  const displayRange = useMemo(() => {
    if (!room?.selectedDate) return null;
    return computeRange(selectedType, room.selectedDate);
  }, [room, selectedType, computeRange]);

  const conflicts =
    room && displayRange
      ? getConflictingReservationsForRange(room.id, displayRange)
      : [];

  const hasConflict = conflicts.length > 0;
  const disabled =
    !room || hasConflict || !isAuthenticated || !displayRange || !companyName;

  return (
    <Modal
      title={room ? `Reserve ${room.name}` : "Reserve"}
      open={!!room}
      onCancel={onClose}
      onOk={() =>
        onReserve({
          room,
          type: selectedType,
          companyName,
          range: displayRange,
        })
      }
      okButtonProps={{ disabled }}
      okText={isAuthenticated ? "Reserve" : "Log in to Reserve"}
      destroyOnClose
    >
      {!isAuthenticated && (
        <Alert
          type="warning"
          message="You must be logged in to make a reservation."
          style={{ marginBottom: 10 }}
        />
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
            <Tag>{displayRange.start}</Tag> <Text>to</Text>{" "}
            <Tag>{displayRange.end}</Tag>
          </div>
        </div>
      )}

      {room?.bookedRanges?.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Existing bookings for this room:</Text>
          <Space direction="vertical" style={{ marginTop: 6 }}>
            {room.bookedRanges.map((b, i) => (
              <div key={i}>
                <Tag>{b.start}</Tag> <Text>to</Text> <Tag>{b.end}</Tag>{" "}
                <Text>({b.type})</Text>
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

      <div style={{ marginTop: 10 }}>
        <Text strong>Company / Organization:</Text>
        <Input
          placeholder="Enter company / organization name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>

      {userEmail && (
        <div style={{ marginTop: 10 }}>
          <Text type="secondary">Reservation will be under: {userEmail}</Text>
        </div>
      )}

      {!room && (
        <Alert
          message="Select a room from the floorplan to reserve."
          type="info"
          style={{ marginTop: 10 }}
        />
      )}
    </Modal>
  );
};

export default React.memo(ReservationModal);
