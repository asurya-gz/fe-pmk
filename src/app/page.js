"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Lock, User, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        "https://be-pmk-production.up.railway.app/api/login",
        formData
      );

      Cookies.set("token", response.data.token, { expires: 7 });
      Cookies.set("id", response.data.user.id, { expires: 7 });

      window.location.href = "/Dashboard";
    } catch (err) {
      console.log("Login response:", err.response);

      const status = err.response?.status;
      const errorMessage = err.response?.data?.message;

      switch (status) {
        case 400:
          setMessage({
            type: "warning",
            text: errorMessage || "Username atau password tidak boleh kosong",
          });
          break;
        case 401:
          setMessage({
            type: "warning",
            text: "Username atau password tidak sesuai",
          });
          break;
        case 404:
          setMessage({
            type: "warning",
            text: "Username tidak ditemukan",
          });
          break;
        default:
          setMessage({
            type: "error",
            text: "Terjadi gangguan sistem, silakan coba beberapa saat lagi",
          });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-sm mx-auto sm:max-w-md">
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-transparent animate-spin-slow"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-l from-white/30 to-transparent animate-spin-reverse-slow"></div>
            <div className="absolute inset-2 sm:inset-3">
              <img src="/logo.png" alt="Logo PMK" />
            </div>
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-purple-900">
            PEMIRA PMK FSM
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-purple-600 font-medium">
            Universitas Diponegoro
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="bg-white/70 backdrop-blur-lg py-6 px-4 sm:py-8 sm:px-10 shadow-xl ring-1 ring-purple-900/5 rounded-xl sm:rounded-2xl">
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-purple-900"
                >
                  Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border-0 bg-white/80 text-purple-900 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-purple-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                    placeholder="Masukkan username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-purple-900"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-9 sm:pl-10 pr-12 py-2 sm:py-2.5 border-0 bg-white/80 text-purple-900 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-purple-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              {message.text && (
                <div
                  className={`${
                    message.type === "warning"
                      ? "bg-yellow-50 border-yellow-400"
                      : "bg-red-50 border-red-400"
                  } border-l-4 p-3 sm:p-4 rounded-lg`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          message.type === "warning"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-xs sm:text-sm ${
                          message.type === "warning"
                            ? "text-yellow-700"
                            : "text-red-700"
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 sm:py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Memproses..." : "Masuk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
