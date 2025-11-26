import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { Row, Col } from "antd";
import "../styles/Login.css";
import { Link } from "react-router-dom";
function Register() {
  const { setIsLoggedIn } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (newUser) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, newUser),
    onSuccess: (res) => {
      setMessage(res.data.message || "Registration successful!");

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        setTimeout(() => navigate("/login"), 1000);
      }
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || "Registration failed");
    },
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(form);
  };

  return (
    <Row className="login-container min-h-screen flex items-center justify-center">
      <Col xs={22} sm={16} md={10} lg={8} xl={6}>
        <div className="login-box bg-white p-8 shadow-xl rounded-xl">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Register
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={form.username}
              onChange={handleChange}
              required
              className="login-input"
            />

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
              disabled={registerMutation.isLoading}
            >
              {registerMutation.isLoading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-gray-700 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Login
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

export default Register;
