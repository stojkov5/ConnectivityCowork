import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const { setIsLoggedIn } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Mutation for register
  const registerMutation = useMutation({
    mutationFn: (newUser) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, newUser),
    onSuccess: (res) => {
      setMessage(res.data.message || "Registration successful!");

      // Auto-login if token returned
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
        navigate("/"); // Redirect to homepage
      } else {
        // Redirect to login after short delay
        setTimeout(() => navigate("/login"), 1000);
      }
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || "Registration failed");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(form);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
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
          className="bg-blue-500 text-white py-2"
          disabled={registerMutation.isLoading}
        >
          {registerMutation.isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default Register;
