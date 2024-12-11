"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Cookies from "js-cookie"; // Import Cookies for cookie handling

const GantiPasswordContent = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For error messages
  const [successMessage, setSuccessMessage] = useState(""); // For success messages
  const [userId, setUserId] = useState(null); // To store the userId from cookies

  // Fetch the userId from cookies when the component mounts
  useEffect(() => {
    const storedUserId = Cookies.get("id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Password baru tidak cocok");
      return;
    }

    if (!userId) {
      setErrorMessage("User tidak ditemukan. Silakan login terlebih dahulu.");
      return;
    }

    try {
      // Send POST request to the API using axios
      const response = await axios.post(
        "http://localhost:4000/api/change-password",
        {
          userId, // Include the userId
          oldPassword, // Include the old password
          newPassword, // Include the new password
          confirmPassword, // Include the confirm password
        }
      );

      // If the request is successful
      setSuccessMessage("Ganti password berhasil");

      // Clear the input fields after success
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage(""); // Reset error message
    } catch (error) {
      // If an error occurs
      setSuccessMessage(""); // Reset success message
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Terjadi kesalahan");
      } else {
        setErrorMessage("Terjadi kesalahan pada server");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-900 mb-4">
        Ganti Password
      </h1>

      {errorMessage && (
        <div className="mb-4 text-red-600">
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 text-green-600">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4 text-gray-600">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-900">
              Password Lama
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-900">
              Password Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-900">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Ganti Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default GantiPasswordContent;
