"use client";
import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import {
  Home,
  Users,
  KeyRound,
  LogOut,
  Menu,
  X,
  UserCheck,
  Vote,
} from "lucide-react";
import { useRouter } from "next/navigation";

import DashboardContent from "./DashboardContent.js";
import ManajemenKandidatContent from "./ManajemenKandidatContent.js";
import GantiPasswordContent from "./GantiPasswordContent.js";
import DaftarPemilihContent from "./DaftarPemilihContent.js";
import ManajemenPemiraContent from "./ManajemenPemiraContent.js";

const DashboardPage = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Function to handle user activity
  const handleUserActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Auto logout check
  useEffect(() => {
    const inactivityTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Check for inactivity every minute
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivity;

      if (timeSinceLastActivity >= inactivityTimeout) {
        // User has been inactive for 30 minutes
        Cookies.remove("token");
        Cookies.remove("id");
        router.push("/Logout");
      }
    }, 60000); // Check every minute

    // Add event listeners for user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup
    return () => {
      clearInterval(intervalId);
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [lastActivity, router, handleUserActivity]);

  // Initial token check
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/Logout");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const menuItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      id: "kandidat",
      icon: Users,
      label: "Manajemen Kandidat",
    },
    {
      id: "daftar-pemilih",
      icon: UserCheck,
      label: "Daftar Pemilih",
    },
    {
      id: "manajemen-pemira",
      icon: Vote,
      label: "Manajemen Pemira",
    },
    {
      id: "ganti-password",
      icon: KeyRound,
      label: "Ganti Password",
    },
  ];

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    router.push("/Logout");
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "kandidat":
        return <ManajemenKandidatContent />;
      case "daftar-pemilih":
        return <DaftarPemilihContent />;
      case "manajemen-pemira":
        return <ManajemenPemiraContent />;
      case "ganti-password":
        return <GantiPasswordContent />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-purple-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 sm:hidden"
      >
        {isSidebarOpen ? (
          <X className="text-purple-900" />
        ) : (
          <Menu className="text-purple-900" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        sm:translate-x-0 sm:relative sm:block
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-purple-100">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-transparent animate-spin-slow"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-l from-white/30 to-transparent animate-spin-reverse-slow"></div>
            <div className="absolute inset-2 sm:inset-3">
              <img src="/logo.png" alt="Logo PMK" />
            </div>
          </div>
          <h2 className="mt-4 text-center text-xl font-bold text-purple-900">
            PEMIRA PMK FSM
          </h2>
          <p className="text-center text-xs text-purple-600">
            Universitas Diponegoro
          </p>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center p-3 rounded-lg mb-2 transition-colors duration-200 ${
                activeMenu === item.id
                  ? "bg-purple-100 text-purple-800"
                  : "text-purple-600 hover:bg-purple-50"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 mt-4"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-purple-50 pt-16 sm:pt-0">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardPage;
