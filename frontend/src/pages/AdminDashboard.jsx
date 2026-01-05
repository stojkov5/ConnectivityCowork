import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Table, Divider, Typography, Tag, Input, Button, message, Popconfirm, Space } from "antd";
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
    data: usersData = [],
    isLoading: usersLoading,
    error: usersError,
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

  // RESERVATIONS (ALL)
  const {
    data: reservationsData = [],
    isLoading: reservationsLoading,
    error: reservationsError,
  } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/reservations/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.reservations;
    },
    enabled: hasToken && isAdmin,
  });

  // ✅ WAITING (awaiting_approval)
  const {
    data: waitingData = [],
    isLoading: waitingLoading,
    error: waitingError,
  } = useQuery({
    queryKey: ["admin-waiting-reservations"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/reservations/admin/waiting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.reservations;
    },
    enabled: hasToken && isAdmin,
  });

  // Group waiting items by groupId so admin approves whole batch (one click)
  const waitingGroups = useMemo(() => {
    const map = new Map();
    for (const r of waitingData) {
      const key = r.groupId || "NO_GROUP";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }

    const rows = [];
    for (const [groupId, list] of map.entries()) {
      const first = list[0];
      rows.push({
        key: groupId,
        groupId,
        email: first.email,
        username: first.user?.username || "-",
        location: first.location,
        officeId: first.officeId,
        resourceType: first.resourceType,
        plan: first.plan,
        startDate: first.startDate,
        endDate: first.endDate,
        companyName: first.companyName || "",
        resources: list.map((x) => x.resourceName || x.resourceId),
        count: list.length,
        userConfirmedAt: first.userConfirmedAt || first.updatedAt || first.createdAt,
      });
    }

    return rows.sort((a, b) => new Date(b.userConfirmedAt) - new Date(a.userConfirmedAt));
  }, [waitingData]);

  // ✅ APPROVE
  const approveBatch = useMutation({
    mutationFn: async (groupId) => {
      return axios.post(
        `${API_URL}/api/reservations/admin/approve/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: (res) => {
      message.success(res.data?.message || "Approved");
      queryClient.invalidateQueries({ queryKey: ["admin-waiting-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      // refresh calendars / offices
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Approve failed";
      message.error(msg);
    },
  });

  // ✅ REJECT
  const rejectBatch = useMutation({
    mutationFn: async ({ groupId, reason }) => {
      return axios.post(
        `${API_URL}/api/reservations/admin/reject/${groupId}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: (res) => {
      message.success(res.data?.message || "Rejected");
      queryClient.invalidateQueries({ queryKey: ["admin-waiting-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Reject failed";
      message.error(msg);
    },
  });

  // PLANS
  const {
    data: plansData = [],
    isLoading: plansLoading,
    error: plansError,
  } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/plans`);
      return res.data.plans;
    },
    enabled: hasToken && isAdmin,
  });

  // UPDATE PLAN
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
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] }); // public Plans.jsx
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to update plan price";
      message.error(msg);
    },
  });

  // SEED PLANS (one-time)
  const seedPlans = useMutation({
    mutationFn: async () => {
      return axios.post(
        `${API_URL}/api/plans/seed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      message.success("Default plans seeded");
      queryClient.invalidateQueries(["admin-plans"]);
      queryClient.invalidateQueries(["plans"]);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to seed plans";
      message.error(msg);
    },
  });

  // TABLE COLUMNS

  const userColumns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (v) => (v ? "Yes" : "No"),
      responsive: ["sm"],
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (v ? new Date(v).toLocaleString() : ""),
      responsive: ["md"],
    },
  ];

  const reservationColumns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const color =
          s === "confirmed"
            ? "green"
            : s === "awaiting_approval"
            ? "gold"
            : s === "pending"
            ? "blue"
            : s === "rejected"
            ? "red"
            : "default";
        return <Tag color={color}>{String(s || "").toUpperCase()}</Tag>;
      },
      responsive: ["sm"],
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
      responsive: ["sm"],
    },
    {
      title: "Resource",
      dataIndex: "resourceId",
      key: "resourceId",
      responsive: ["sm"],
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
      responsive: ["sm"],
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      render: (v) => v || "-",
      responsive: ["md"],
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => dayjs(v).format("YYYY-MM-DD HH:mm"),
      responsive: ["lg"],
    },
  ];

  const waitingColumns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      responsive: ["md"],
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
      responsive: ["sm"],
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
      responsive: ["sm"],
    },
    {
      title: "Resources",
      key: "resources",
      render: (_, record) => (
        <span>
          <Tag>{record.count}</Tag>{" "}
          {record.resources.slice(0, 3).join(", ")}
          {record.resources.length > 3 ? "..." : ""}
        </span>
      ),
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
      responsive: ["sm"],
    },
    {
      title: "Confirmed by user",
      dataIndex: "userConfirmedAt",
      key: "userConfirmedAt",
      render: (d) => (d ? dayjs(d).format("YYYY-MM-DD HH:mm") : "-"),
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Popconfirm
            title="Approve this reservation batch?"
            onConfirm={() => approveBatch.mutate(record.groupId)}
            okText="Approve"
            cancelText="Cancel"
          >
            <Button type="primary" size="small" loading={approveBatch.isPending}>
              Approve
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Reject this reservation batch?"
            onConfirm={() => rejectBatch.mutate({ groupId: record.groupId, reason: "Rejected by admin" })}
            okText="Reject"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" loading={rejectBatch.isPending}>
              Reject
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
          saving={updatePlan.isPending}
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
      responsive: ["sm"],
    },
  ];

  if (!hasToken || !isAdmin) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
          <Title level={3} className="mb-2!">
            Access denied
          </Title>
          <p>You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-3 sm:px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Title
          level={2}
          className="text-2xl! sm:text-3xl! mb-4! sm:mb-6! md:mb-8!"
        >
          Admin Dashboard
        </Title>

        {/* USERS */}
        <Divider>Registered Users</Divider>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md mb-8 sm:mb-12">
          {usersError && (
            <div className="mb-2 text-red-500 text-sm">
              {usersError.response?.data?.message || usersError.message}
            </div>
          )}
          <div className="w-full overflow-x-auto">
            <Table
              rowKey="_id"
              dataSource={usersData}
              columns={userColumns}
              loading={usersLoading}
              size="small"
              scroll={{ x: true }}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>

        {/* ✅ WAITING RESERVATIONS */}
        <Divider>Waiting Reservations (Admin approval)</Divider>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md mb-8 sm:mb-12">
          {waitingError && (
            <div className="mb-2 text-red-500 text-sm">
              {waitingError.response?.data?.message || waitingError.message}
            </div>
          )}
          <div className="w-full overflow-x-auto">
            <Table
              rowKey="groupId"
              dataSource={waitingGroups}
              columns={waitingColumns}
              loading={waitingLoading}
              size="small"
              scroll={{ x: true }}
              pagination={{ pageSize: 20 }}
            />
          </div>
        </div>

        {/* RESERVATIONS */}
        <Divider>All Reservations</Divider>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md mb-8 sm:mb-12">
          {reservationsError && (
            <div className="mb-2 text-red-500 text-sm">
              {reservationsError.response?.data?.message ||
                reservationsError.message}
            </div>
          )}
          <div className="w-full overflow-x-auto">
            <Table
              rowKey="_id"
              dataSource={reservationsData}
              columns={reservationColumns}
              loading={reservationsLoading}
              size="small"
              scroll={{ x: true }}
              pagination={{ pageSize: 20 }}
            />
          </div>
        </div>

        {/* PLANS */}
        <Divider>Plans & Pricing</Divider>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
            <Button
              onClick={() => seedPlans.mutate()}
              loading={seedPlans.isPending}
              type="default"
              size="small"
            >
              Seed default plans
            </Button>
            <span className="text-gray-500 text-xs sm:text-sm">
              Click once on a fresh DB. If plans already exist, it will show an
              error message.
            </span>
          </div>

          {plansError && (
            <div className="mb-2 text-red-500 text-sm">
              {plansError.response?.data?.message || plansError.message}
            </div>
          )}
          <div className="w-full overflow-x-auto">
            <Table
              rowKey={(record) => record._id || record.key}
              dataSource={plansData}
              columns={planColumns}
              loading={plansLoading}
              size="small"
              scroll={{ x: true }}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
