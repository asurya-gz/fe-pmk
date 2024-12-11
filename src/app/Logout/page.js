"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Destroy the token cookie
    Cookies.remove("token"); // Replace "token" with your actual cookie name if different
    Cookies.remove("id"); // Replace "token" with your actual cookie name if different

    // Redirect to the homepage after a short delay
    setTimeout(() => {
      router.push("/"); // Redirect to the homepage
    }, 2000); // Redirect after 2 seconds, adjust as needed
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-purple-50">
      <div className="text-center">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-transparent animate-spin-slow"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-l from-white/30 to-transparent animate-spin-reverse-slow"></div>
          <div className="absolute inset-2 sm:inset-3">
            <img src="/logo.png" alt="Logo PMK" />
          </div>
        </div>
        <p className="mt-4 text-xl font-bold text-purple-900">
          Tuhan memberkati...
        </p>
      </div>
    </div>
  );
};

export default LogoutPage;
