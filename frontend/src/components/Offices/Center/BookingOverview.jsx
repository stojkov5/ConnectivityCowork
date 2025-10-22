/* eslint-disable no-unused-vars */
// BookingOverview.jsx
import React from "react";
import { List, Tag, Empty, Popconfirm, Button } from "antd";
import dayjs from "dayjs";

const BookingOverview = ({ reservations = [], seats = [], onDelete, showDelete = false }) => {
  const getSeatName = (seatId, officeId) => {
    const seat = seats.find((s) => s.id === seatId);
    return seat ? seat.name : seatId;
  };

  if (!reservations || reservations.length === 0) {
    return <Empty description="No reservations yet" />;
  }

  const sorted = [...reservations].sort((a, b) => {
    if (a.startDate === b.startDate) return a.seatId.localeCompare(b.seatId);
    return dayjs(a.startDate).isBefore(dayjs(b.startDate)) ? -1 : 1;
  });

  return (
    <div style={{ maxHeight: 480, overflow: "auto" }}>
      <List
        itemLayout="vertical"
        dataSource={sorted}
        renderItem={(res) => (
          <List.Item
            key={`${res.officeId}-${res.seatId}-${res.startDate}-${res.endDate}`}
            actions={
              showDelete
                ? [
                    <Popconfirm
                      key="del"
                      title="Delete this reservation?"
                      onConfirm={() => onDelete && onDelete(res)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger size="small">
                        Delete
                      </Button>
                    </Popconfirm>,
                  ]
                : []
            }
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Tag>{res.officeName || res.officeId}</Tag>
              <Tag>{getSeatName(res.seatId)}</Tag>
              <Tag color="default">{res.startDate}</Tag>
              <Tag color="default">{res.endDate}</Tag>
              <Tag color="processing">{res.type}</Tag>
            </div>
            <div style={{ marginTop: 6, color: "#666", fontSize: 12 }}>
              Created: {dayjs(res.createdAt).format("YYYY-MM-DD HH:mm")}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default React.memo(BookingOverview);
