import React from "react";
import { List, Tag, Empty } from "antd";
import dayjs from "dayjs";

const BookingOverview = ({ reservations = [], rooms = [] }) => {
  const getRoomName = (roomId) => {
    const r = rooms.find((x) => x.id === roomId);
    return r ? r.name : roomId;
  };

  if (!reservations || reservations.length === 0) {
    return <Empty description="No reservations yet" />;
  }

  const sorted = [...reservations].sort((a, b) => {
    if (a.date === b.date) return a.slot.localeCompare(b.slot);
    return dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1;
  });

  return (
    <div className="booking-overview" style={{ maxHeight: 480, overflow: "auto" }}>
      <List
        itemLayout="vertical"
        dataSource={sorted}
        renderItem={(res) => (
          <List.Item
            key={`${res.roomId}-${res.date}-${res.slot}`}
            actions={[
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Tag>{res.roomName || getRoomName(res.roomId)}</Tag>
                <Tag color="default">{res.date}</Tag>
                <Tag color="processing">{res.slot}</Tag>
              </div>,
            ]}
          />
        )}
      />
    </div>
  );
};

export default BookingOverview;
