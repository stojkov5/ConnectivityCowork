import React from "react";
import { Modal, Select, Tag, Alert } from "antd";

const ReservationModal = ({
  room,
  slot,
  onSlotChange,
  onClose,
  onReserve,
  getAvailableSlots,
}) => {
  const available = room ? getAvailableSlots(room) : [];

  return (
    <Modal
      title={room ? `Reserve ${room.name}` : "Reserve"}
      open={!!room}
      onCancel={onClose}
      onOk={onReserve}
      okButtonProps={{ disabled: !slot }}
      okText="Reserve"
      destroyOnClose
    >
      <Select
        value={slot}
        onChange={onSlotChange}
        style={{ width: "100%" }}
        placeholder="Select time slot"
        options={available.map((s) => ({ value: s, label: s }))}
      />

      {room?.bookedSlots?.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <span>Booked slots:</span>
          {room.bookedSlots.map((s) => (
            <Tag color="red" key={s} style={{ marginLeft: 5 }}>
              {s}
            </Tag>
          ))}
        </div>
      )}

      {available.length === 0 && (
        <Alert message="No available slots" type="error" style={{ marginTop: 10 }} />
      )}
    </Modal>
  );
};

export default React.memo(ReservationModal);
