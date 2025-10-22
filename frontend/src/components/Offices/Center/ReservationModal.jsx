/* eslint-disable no-unused-vars */
// ReservationModal.jsx
import React, { useMemo } from "react";
import { Modal, Select, Tag, Alert, Space, Typography } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const ReservationModal = ({
  seat,
  selectedType,
  onTypeChange,
  onClose,
  onReserve,
  computeRange,
  getConflictingReservationsForRange,
  isAuthenticated,
}) => {
  // seat may contain selectedDate (dayjs) from parent
  const displayRange = seat?.selectedDate ? computeRange(selectedType, seat.selectedDate) : null;

  const conflicts = seat && displayRange ? getConflictingReservationsForRange(seat.id, displayRange, seat.officeId) : [];

  const hasConflict = conflicts && conflicts.length > 0;
  const disabled = !seat || hasConflict || !isAuthenticated;

  return (
    <Modal
      title={seat ? `Reserve ${seat.name}` : "Reserve"}
      open={!!seat}
      onCancel={onClose}
      onOk={() => onReserve(seat, selectedType)}
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

      {seat?.bookedRanges?.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Existing bookings for this seat:</Text>
          <Space direction="vertical" style={{ marginTop: 6 }}>
            {seat.bookedRanges.map((b, i) => (
              <div key={i}>
                <Tag>{b.start}</Tag> <Text>to</Text> <Tag>{b.end}</Tag> <Text>({b.type})</Text>
              </div>
            ))}
          </Space>
        </div>
      )}

      {hasConflict && (
        <Alert
          message="This seat has a conflicting reservation during the selected range."
          type="error"
          showIcon
          style={{ marginTop: 10 }}
        />
      )}

      {!seat && <Alert message="Select a seat from the floorplan to reserve." type="info" style={{ marginTop: 10 }} />}
    </Modal>
  );
};

export default React.memo(ReservationModal);
