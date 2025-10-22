// BookingOverview.jsx
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
    if (a.startDate === b.startDate) return a.roomId.localeCompare(b.roomId);
    return dayjs(a.startDate).isBefore(dayjs(b.startDate)) ? -1 : 1;
  });

  return (
    <div className="booking-overview" style={{ maxHeight: 480, overflow: "auto" }}>
      <List
        itemLayout="vertical"
        dataSource={sorted}
        renderItem={(res) => (
          <List.Item key={`${res.roomId}-${res.startDate}-${res.endDate}`}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Tag>{getRoomName(res.roomId)}</Tag>
              <Tag color="default">{res.startDate}</Tag>
              <Tag color="default">{res.endDate}</Tag>
              <Tag color="processing">{res.type}</Tag>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default BookingOverview;
