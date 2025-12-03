// src/components/Offices/KiselaVoda/ReservationModal.jsx
import React, { useMemo } from "react";
import { Modal, Alert, Tag, Space, Typography, Input } from "antd";

const { Text } = Typography;

const ReservationModal = ({
  open,
  onClose,
  range,
  plan,
  selectedRooms,
  userEmail,
  companyName,
  onCompanyNameChange,
  hasConflicts,
  conflictDetails,
  onConfirm,
  isAuthenticated,
}) => {
  const planLabel = useMemo(() => {
    if (plan === "daily") return "Daily";
    if (plan === "weekly") return "Weekly (7 days)";
    if (plan === "monthly") return "Monthly";
    return plan || "";
  }, [plan]);

  const confirmDisabled =
    !isAuthenticated ||
    !range ||
    !selectedRooms ||
    selectedRooms.length === 0 ||
    !companyName.trim() ||
    hasConflicts;

  return (
    <Modal
      title="Confirm Reservation"
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      okButtonProps={{ disabled: confirmDisabled }}
      okText={
        !isAuthenticated
          ? "Log in to reserve"
          : hasConflicts
          ? "Cannot reserve"
          : "Send verification email"
      }
      destroyOnClose
    >
      {!isAuthenticated && (
        <Alert
          type="warning"
          message="You must be logged in to make a reservation."
          style={{ marginBottom: 12 }}
        />
      )}

      {hasConflicts && conflictDetails.length > 0 && (
        <Alert
          type="error"
          showIcon
          message="Some selected rooms are already booked in the selected period."
          description={
            <div style={{ marginTop: 8 }}>
              {conflictDetails.map((room) => (
                <div key={room.id} style={{ marginBottom: 6 }}>
                  <Text strong>{room.name}</Text>
                  <br />
                  {room.reservations.map((r, idx) => (
                    <div key={idx}>
                      <Tag>{r.startDate}</Tag> to <Tag>{r.endDate}</Tag>{" "}
                      <Text>({r.type})</Text>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          }
          style={{ marginBottom: 12 }}
        />
      )}

      <div style={{ marginBottom: 10 }}>
        <Text strong>Plan:</Text> <Text>{planLabel}</Text>
      </div>

      {range && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Range:</Text>
          <div style={{ marginTop: 4 }}>
            <Tag>{range.start}</Tag> to <Tag>{range.end}</Tag>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <Text strong>Selected rooms:</Text>
        {selectedRooms && selectedRooms.length > 0 ? (
          <Space direction="vertical" style={{ marginTop: 4 }}>
            {selectedRooms.map((room) => (
              <Tag key={room.id}>{room.name}</Tag>
            ))}
          </Space>
        ) : (
          <div style={{ marginTop: 4 }}>
            <Text type="secondary">No rooms selected.</Text>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
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
          <Text type="secondary">
            Reservation email will be sent to: {userEmail}
          </Text>
        </div>
      )}

      {!hasConflicts && (
        <Alert
          type="info"
          showIcon
          style={{ marginTop: 12 }}
          message="After confirming, you will receive an email with a link to finalize this reservation."
        />
      )}
    </Modal>
  );
};

export default React.memo(ReservationModal);
