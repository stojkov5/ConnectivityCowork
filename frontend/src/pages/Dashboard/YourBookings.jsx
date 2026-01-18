import React from "react";
import { Table, Tag, Alert } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const statusColor = {
  pending: "orange",
  awaiting_approval: "gold",
  confirmed: "green",
  rejected: "red",
  cancelled: "default",
};

const YourBookings = () => {
  const { token } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/reservations/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.reservations;
    },
    enabled: !!token,
  });

  const columns = [
    {
      title: "Location",
      dataIndex: "location",
      render: (v) => v.toUpperCase(),
    },
    {
      title: "Office",
      dataIndex: "officeId",
    },
    {
      title: "Resource",
      render: (_, r) => `${r.resourceType}: ${r.resourceId}`,
    },
    {
      title: "Plan",
      dataIndex: "plan",
      render: (p) => p.toUpperCase(),
    },
    {
      title: "From",
      dataIndex: "startDate",
      render: (d) => dayjs(d).format("YYYY-MM-DD"),
    },
    {
      title: "To",
      dataIndex: "endDate",
      render: (d) => dayjs(d).format("YYYY-MM-DD"),
    },
    {
      title: "Company",
      dataIndex: "companyName",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColor[s]}>{s.replace("_", " ")}</Tag>,
    },
  ];

  if (error) {
    return <Alert type="error" message="Failed to load bookings" />;
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 20 }}>Your Bookings</h2>

      <Table
        rowKey="_id"
        loading={isLoading}
        columns={columns}
        dataSource={data || []}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default YourBookings;
