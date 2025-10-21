import React, { useMemo } from "react";
import { Table, Button } from "antd";
import VirtualList from "rc-virtual-list";

const containerHeight = 400; // height for scrollable area

const BookingOverview = ({ reservations }) => {
  // Prepare table data
  const data = useMemo(
    () =>
      reservations.map((res, index) => ({
        key: index,
        seatName: res.seatName,
        date: res.date,
        slot: res.slot,
        original: res, // keep original for deletion
      })),
    [reservations]
  );

  const columns = useMemo(() => [
    { title: "Seat", dataIndex: "seatName", key: "seatName" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time Slot", dataIndex: "slot", key: "slot" },
  ], []);

  return (
    <div style={{ maxHeight: containerHeight, overflow: "auto" }}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        components={{
          body: () => (
            <VirtualList
              data={data}
              height={containerHeight}
              itemHeight={54} // approximate row height
              itemKey="key"
            >
              {(item) => (
                <tr key={item.key}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(null, item)
                        : item[col.dataIndex]}
                    </td>
                  ))}
                </tr>
              )}
            </VirtualList>
          ),
        }}
      />
    </div>
  );
};

export default React.memo(BookingOverview);
