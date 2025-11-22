import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Table, Divider, Typography, Tag } from "antd";
import { useAuth } from "../context/AuthContext.jsx";
import dayjs from "dayjs";

const { Title } = Typography;

const AdminDashboard = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // === USERS QUERY ===
  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.users;
    },
    enabled: !!token,
  });

  // === RESERVATIONS QUERY ===
  const reservationsQuery = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/reservations/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.reservations;
    },
    enabled: !!token,
  });

  // COLUMNS FOR USERS TABLE
  const userColumns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (v) => (v ? "Yes" : "No"),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (v ? new Date(v).toLocaleString() : ""),
    },
  ];

  // COLUMNS FOR RESERVATIONS TABLE
  const reservationColumns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (loc) =>
        loc === "centar" ? "Centar" : loc === "kiselavoda" ? "Kisela Voda" : loc,
    },
    {
      title: "Office",
      dataIndex: "officeId",
      key: "officeId",
    },
    {
      title: "Type",
      dataIndex: "resourceType",
      key: "resourceType",
      render: (v) =>
        v === "room" ? <Tag color="geekblue">ROOM</Tag> : <Tag color="green">SEAT</Tag>,
    },
    {
      title: "Resource",
      dataIndex: "resourceId",
      key: "resourceId",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (plan) => {
        const color =
          plan === "daily" ? "blue" : plan === "weekly" ? "purple" : "orange";
        return <Tag color={color}>{plan.toUpperCase()}</Tag>;
      },
    },
    {
      title: "From",
      dataIndex: "startDate",
      key: "startDate",
      render: (d) => dayjs(d).format("YYYY-MM-DD"),
    },
    {
      title: "To",
      dataIndex: "endDate",
      key: "endDate",
      render: (d) => dayjs(d).format("YYYY-MM-DD"),
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      render: (v) => v || "-",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => dayjs(v).format("YYYY-MM-DD HH:mm"),
    },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 md:px-16 bg-gray-50">
      <Title level={2}>Admin Dashboard</Title>

      {/* USERS TABLE */}
      <Divider>Registered Users</Divider>
      <div className="bg-white p-4 rounded-xl shadow-md mb-12">
        <Table
          rowKey="_id"
          dataSource={usersQuery.data || []}
          columns={userColumns}
          loading={usersQuery.isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* RESERVATIONS TABLE */}
      <Divider>All Reservations</Divider>
      <div className="bg-white p-4 rounded-xl shadow-md">
        <Table
          rowKey="_id"
          dataSource={reservationsQuery.data || []}
          columns={reservationColumns}
          loading={reservationsQuery.isLoading}
          pagination={{ pageSize: 20 }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
