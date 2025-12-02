// src/pages/VerifyEmail.jsx
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["verify-email", token],
    enabled: !!token,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.message) {
      // Optionally auto-redirect after a delay
      const id = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [data, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>

        {isLoading && <p>Verifying your email...</p>}

        {isError && (
          <p className="text-red-500">
            {error?.response?.data?.message ||
              "Verification link is invalid or has expired."}
          </p>
        )}

        {!isLoading && !isError && data?.message && (
          <>
            <p className="text-green-600 mb-4">{data.message}</p>
            <p>
              Redirecting you to{" "}
              <Link to="/login" className="text-blue-500 underline">
                login
              </Link>{" "}
              in a moment...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
