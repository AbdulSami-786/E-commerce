import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingEmail");

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>No email found. Please sign up again.</p>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/verify-code", { email, code });
      setMessage(res.data.message);
      // Save login info
      localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
localStorage.setItem("isVerified", "true");
      localStorage.removeItem("pendingEmail");
      navigate("/"); // redirect to home after successful verification
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
        <p className="text-center mb-4 text-gray-600">
          Enter the 5-character verification code sent to <b>{email}</b>
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded text-center tracking-widest uppercase"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Verify Email
          </button>
        </form>
        {message && (
          <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
