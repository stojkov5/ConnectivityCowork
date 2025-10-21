import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { setIsLoggedIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (user) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, user),
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      setMessage("Login successful!");
      navigate("/");
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || "Login failed");
    },
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2"
          disabled={loginMutation.isLoading}
        >
          {loginMutation.isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default Login;
