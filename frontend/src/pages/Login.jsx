import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Row, Col } from "antd";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const { login } = useAuth(); // from AuthContext
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (user) => axios.post(`${API_URL}/api/auth/login`, user),
    onSuccess: (res) => {
      const { token, user } = res.data || {};

      if (!token || !user) {
        setMessage("Invalid server response");
        return;
      }

      // store in sessionStorage + context
      login(token, user);

      setMessage("Login successful!");
      navigate("/");
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || "Login failed");
    },
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <Row className="login-container min-h-screen flex items-center justify-center raleway-600">
      <Col xs={22} sm={16} md={10} lg={8} xl={6}>
        <div className="login-box bg-white p-8 shadow-xl rounded-xl">
          <h1 className="text-3xl text-center mb-6">LOGIN</h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 raleway-300"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="login-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="login-input"
            />

            <button
              type="submit"
              className="login-btn"
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-500">
                Register
              </Link>
            </p>
          </form>

          {message && (
            <p className="mt-4 text-center text-gray-700 font-medium">
              {message}
            </p>
          )}
        </div>
      </Col>
    </Row>
  );
}

export default Login;
