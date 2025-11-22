import React from "react";
import { Modal, Tag, Typography, Input, Alert, List } from "antd";

const { Text } = Typography;

const ReservationModal = ({
  open,
  onClose,
  range,
  plan,
  selectedSeats = [],
  userEmail,
  companyName,
  onCompanyNameChange,
  hasConflicts,
  conflictDetails = [],
  onConfirm,
  isAuthenticated,
}) => {
  const disabled =
    !isAuthenticated ||
    !range ||
    !plan ||
    selectedSeats.length === 0 ||
    !companyName.trim() ||
    hasConflicts;

  return (
    <Modal
      title="Confirm Reservation"
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
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

      {range && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Range:</Text>
          <div style={{ marginTop: 6 }}>
            <Tag>{range.start}</Tag> <Text>to</Text> <Tag>{range.end}</Tag>
          </div>
        </div>
      )}

      {plan && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Plan:</Text> <Tag>{plan}</Tag>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <Text strong>Selected seats:</Text>
        {selectedSeats.length === 0 ? (
          <div style={{ marginTop: 6 }}>
            <Text type="secondary">No seats selected.</Text>
          </div>
        ) : (
          <List
            size="small"
            dataSource={selectedSeats}
            renderItem={(s) => (
              <List.Item style={{ padding: "4px 0" }}>
                <Tag>{s.name}</Tag>
              </List.Item>
            )}
            style={{ marginTop: 6, maxHeight: 160, overflowY: "auto" }}
          />
        )}
      </div>

      {userEmail && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>Reservation under:</Text>{" "}
          <Text type="secondary">{userEmail}</Text>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <Text strong>Company / Organization:</Text>
        <Input
          placeholder="Enter company / organization name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>

      {hasConflicts && conflictDetails.length > 0 && (
        <Alert
          type="error"
          showIcon
          style={{ marginTop: 10 }}
          message="Some selected seats have conflicting reservations."
          description={
            <List
              size="small"
              dataSource={conflictDetails}
              renderItem={(item) => (
                <List.Item>
                  <div>
                    <Text strong>{item.name}</Text>
                    {item.reservations.map((r, idx) => (
                      <div key={idx}>
                        <Tag>{r.startDate}</Tag> <Text>to</Text>{" "}
                        <Tag>{r.endDate}</Tag> <Text>({r.type})</Text>
                      </div>
                    ))}
                  </div>
                </List.Item>
              )}
            />
          }
        />
      )}
    </Modal>
  );
};

export default React.memo(ReservationModal);
