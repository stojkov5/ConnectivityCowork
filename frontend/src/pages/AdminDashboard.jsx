import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Table } from "antd";
import { useAuth } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const { token } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.users;
    },
    enabled: !!token, // only run if token exists
  });

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value ? new Date(value).toLocaleString() : "",
    },
  ];

  if (isLoading) return <div className="p-8">Loading users...</div>;
  if (isError)
    return (
      <div className="p-8">
        Error: {error?.response?.data?.message || error.message}
      </div>
    );

  return (
    <div className="min-h-screen pt-24 px-4 md:px-16 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      <p className="mb-4 text-gray-600">All registered users</p>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <Table
          rowKey="_id"
          dataSource={data || []}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
