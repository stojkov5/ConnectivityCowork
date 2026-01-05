// src/pages/ConfirmReservation.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Result, Button, Spin } from "antd";

const API_URL = import.meta.env.VITE_API_URL;

const ConfirmReservation = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const confirm = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/reservations/confirm/${token}`
        );
        if (!isMounted) return;
        setStatus("success");
        setMessage(
          res.data?.message ||
            "Reservation confirmed. Now waiting for admin approval."
        );
      } catch (err) {
        if (!isMounted) return;
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Unable to confirm this reservation link."
        );
      }
    };

    if (token) confirm();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Result
          status="success"
          title="Reservation verified!"
          subTitle={message}
          extra={
            <Link to="/">
              <Button type="primary">Back to Home</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="error"
        title="Reservation confirmation failed"
        subTitle={message}
        extra={
          <Link to="/">
            <Button type="primary">Back to Home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default ConfirmReservation;
