import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  Divider,
  Typography,
  Tag,
  Input,
  Button,
  message,
} from "antd";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext.jsx";

const { Title } = Typography;
const API_URL = import.meta.env.VITE_API_URL;

// Inline editor for plan price
const PriceEditor = ({ record, onSave, saving }) => {
  const [value, setValue] = useState(record.price);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="small"
      />
      <Button
        size="small"
        type="primary"
        loading={saving}
        onClick={() => onSave(record.key, value)}
      >
        Save
      </Button>
    </div>
  );
};

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const isAdmin = !!user?.isAdmin;
  const hasToken = !!token;

  // USERS
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorObj,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.users;
    },
    enabled: hasToken && isAdmin,
  });

  // RESERVATIONS
  const {
    data: reservations = [],
    isLoading: resLoading,
    isError: resError,
    error: resErrorObj,
  } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/reservations/admin/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.reservations;
    },
    enabled: hasToken && isAdmin,
  });

  // PLANS
  const {
    data: plans = [],
    isLoading: plansLoading,
    isError: plansError,
    error: plansErrorObj,
  } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/plans`);
      return res.data.plans;
    },
    enabled: hasToken && isAdmin,
  });

  // UPDATE PLAN MUTATION
  const updatePlan = useMutation({
    mutationFn: async ({ key, price }) => {
      return axios.put(
        `${API_URL}/api/plans/${key}`,
        { price },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      message.success("Plan updated");
      queryClient.invalidateQueries(["admin-plans"]);
      queryClient.invalidateQueries(["plans"]); // public plans
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || "Failed to update plan price";
      message.error(msg);
    },
  });

  // USERS TABLE COLUMNS
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

  // RESERVATIONS TABLE COLUMNS
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
        loc === "centar"
          ? "Centar"
          : loc === "kiselavoda"
          ? "Kisela Voda"
          : loc,
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
        v === "room" ? (
          <Tag color="geekblue">ROOM</Tag>
        ) : (
          <Tag color="green">SEAT</Tag>
        ),
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
          plan === "daily"
            ? "blue"
            : plan === "weekly"
            ? "purple"
            : "orange";
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

  // PLANS TABLE COLUMNS
  const planColumns = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <PriceEditor
          record={record}
          saving={updatePlan.isLoading}
          onSave={(key, price) => updatePlan.mutate({ key, price })}
        />
      ),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (c) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: c || "#ff8c00",
              border: "1px solid #ddd",
            }}
          />
          <span>{c}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 md:px-16 bg-gray-50">
      {!isAdmin ? (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Title level={3}>Access denied</Title>
          <p>You are not authorized to view this page.</p>
        </div>
      ) : (
        <>
          <Title level={2}>Admin Dashboard</Title>

          {/* USERS */}
          <Divider>Registered Users</Divider>
          <div className="bg-white p-4 rounded-xl shadow-md mb-12">
            {usersError && (
              <div className="mb-2 text-red-500">
                {usersErrorObj?.response?.data?.message ||
                  usersErrorObj?.message}
              </div>
            )}
            <Table
              rowKey="_id"
              dataSource={users}
              columns={userColumns}
              loading={usersLoading}
              pagination={{ pageSize: 10 }}
            />
          </div>

          {/* RESERVATIONS */}
          <Divider>All Reservations</Divider>
          <div className="bg-white p-4 rounded-xl shadow-md mb-12">
            {resError && (
              <div className="mb-2 text-red-500">
                {resErrorObj?.response?.data?.message ||
                  resErrorObj?.message}
              </div>
            )}
            <Table
              rowKey="_id"
              dataSource={reservations}
              columns={reservationColumns}
              loading={resLoading}
              pagination={{ pageSize: 20 }}
            />
          </div>

          {/* PLANS / PRICING */}
          <Divider>Plans & Pricing</Divider>
          <div className="bg-white p-4 rounded-xl shadow-md">
            {plansError && (
              <div className="mb-2 text-red-500">
                {plansErrorObj?.response?.data?.message ||
                  plansErrorObj?.message}
              </div>
            )}
            <Table
              rowKey="_id"
              dataSource={plans}
              columns={planColumns}
              loading={plansLoading}
              pagination={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
