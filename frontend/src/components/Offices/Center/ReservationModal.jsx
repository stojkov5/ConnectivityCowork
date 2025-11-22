/* eslint-disable no-unused-vars */
// ReservationModal.jsx
import React, { useMemo } from "react";
import { Modal, Select, Tag, Alert, Space, Typography, Input } from "antd";
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
  userEmail,
  companyName,
  onCompanyNameChange,
}) => {
  const displayRange = seat?.selectedDate
    ? computeRange(selectedType, seat.selectedDate)
    : null;

  const conflicts =
    seat && displayRange
      ? getConflictingReservationsForRange(seat.id, displayRange)
      : [];

  const hasConflict = conflicts.length > 0;

  const disabled =
    !seat ||
    !displayRange ||
    !isAuthenticated ||
    hasConflict ||
    companyName.trim().length === 0;

  return (
    <Modal
      title={seat ? `Reserve ${seat.name}` : "Reserve"}
      open={!!seat}
      onCancel={onClose}
      onOk={() =>
        onReserve({
          seat,
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
            { value: "weekly", label: "Weekly (7 days)" },
            { value: "monthly", label: "Monthly" },
          ]}
        />
      </div>

      {displayRange && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Range:</Text>
          <div style={{ marginTop: 6 }}>
            <Tag>{displayRange.start}</Tag> to <Tag>{displayRange.end}</Tag>
          </div>
        </div>
      )}

      {seat?.bookedRanges?.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Existing bookings for this seat:</Text>
          <Space direction="vertical" style={{ marginTop: 6 }}>
            {seat.bookedRanges.map((b, i) => (
              <div key={i}>
                <Tag>{b.start}</Tag> to <Tag>{b.end}</Tag>{" "}
                <Text>({b.type})</Text>
              </div>
            ))}
          </Space>
        </div>
      )}

      {hasConflict && (
        <Alert
          message="This seat has a conflicting reservation during the selected period."
          type="error"
          showIcon
          style={{ marginTop: 10 }}
        />
      )}

      <div style={{ marginTop: 10 }}>
        <Text strong>Company / Organization:</Text>
        <Input
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>

      {userEmail && (
        <div style={{ marginTop: 10 }}>
          <Text type="secondary">Reservation under: {userEmail}</Text>
        </div>
      )}
    </Modal>
  );
};

export default React.memo(ReservationModal);
