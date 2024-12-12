"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserCircle,
  BookOpen,
  GraduationCap,
  Calendar,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Status Pemira
const VotingStatus = {
  BERLANGSUNG: "berlangsung",
  TUTUP: "tutup",
  SELESAI: "selesai",
};

const WelcomeSplash = () => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col items-center justify-center animate-fade-out">
      <div className="relative">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-transparent animate-spin-slow"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-l from-white/30 to-transparent animate-spin-reverse-slow"></div>
          <div className="absolute inset-4 sm:inset-6">
            <img
              src="/logo.png"
              alt="Logo PMK"
              className="w-full h-full rounded-full shadow-lg object-cover"
            />
          </div>
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-purple-900 text-center mb-4 animate-fade-in mt-6">
        Selamat Datang Di
      </h1>
      <p className="text-xl sm:text-2xl font-semibold text-purple-700 text-center animate-fade-in">
        PEMIRA PMK FSM UNDIP
      </p>
    </div>
  );
};

const StatusDisplay = ({ status }) => {
  const statusMessages = {
    [VotingStatus.TUTUP]: {
      title: "Pemilihan Sedang Ditutup",
      description:
        "Saat ini, proses Pemilihan Raya (Pemira) sedang tidak aktif. Silakan hubungi panitia untuk informasi lebih lanjut.",
    },
    [VotingStatus.SELESAI]: {
      title: "Pemilihan Telah Selesai",
      description:
        "Proses Pemilihan Raya (Pemira) telah usai. Terima kasih atas partisipasi Anda.",
    },
  };

  const { title, description } = statusMessages[status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col justify-center items-center px-4 text-center">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-xl shadow-xl ring-1 ring-purple-900/5 max-w-md">
        <div className="flex justify-center mb-6">
          <Lock className="h-16 w-16 text-purple-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-4">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-purple-700">{description}</p>
      </div>
    </div>
  );
};

const IdentityPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [votingStatus, setVotingStatus] = useState(VotingStatus.SELESAI);
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    jurusan: "",
    angkatan: "",
  });

  // Generate angkatan options dynamically (4 years back and 4 years forward)
  const generateAngkatanOptions = () => {
  const currentYear = new Date().getFullYear();
  const angkatanOptions = [];
  for (let i = -8; i <= 8; i++) {
    angkatanOptions.push(currentYear + i);
  }
  return angkatanOptions.map((year) => year.toString());
};
  useEffect(() => {
    const fetchVotingStatus = async () => {
      try {
        const response = await axios.get(
          "https://be-pmk-production.up.railway.app/api/voting"
        );
        setVotingStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching voting status:", error);
        setVotingStatus(VotingStatus.TUTUP);
      }
    };

    fetchVotingStatus();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send voter data to the backend
      const response = await axios.post(
        "https://be-pmk-production.up.railway.app/api/add-voter",
        formData
      );

      // Redirect to voting page with NIM
      router.push(`/Vote?nim=${formData.nim}`);
    } catch (error) {
      console.error("Error submitting voter data:", error);
      // Optionally handle error (show message to user)
      setLoading(false);
    }
  };

  // Render status display for voting closed or completed
  if (
    votingStatus === VotingStatus.TUTUP ||
    votingStatus === VotingStatus.SELESAI
  ) {
    return (
      <>
        {showSplash && <WelcomeSplash />}
        <StatusDisplay status={votingStatus} />
      </>
    );
  }

  return (
    <>
      {showSplash && <WelcomeSplash />}
      <div
        className={`min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8 transition-opacity duration-500 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
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
              Data Identitas
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-purple-600 font-medium">
              Silakan lengkapi data diri Anda
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            <div className="bg-white/70 backdrop-blur-lg py-6 px-4 sm:py-8 sm:px-10 shadow-xl ring-1 ring-purple-900/5 rounded-xl sm:rounded-2xl">
              <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm font-medium text-purple-900"
                  >
                    Nama Lengkap
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    </div>
                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      required
                      value={formData.nama}
                      onChange={handleChange}
                      className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border-0 bg-white/80 text-purple-900 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-purple-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="nim"
                    className="block text-sm font-medium text-purple-900"
                  >
                    NIM
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    </div>
                    <input
                      id="nim"
                      name="nim"
                      type="text"
                      required
                      value={formData.nim}
                      onChange={handleChange}
                      className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border-0 bg-white/80 text-purple-900 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-purple-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                      placeholder="Masukkan NIM"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="jurusan"
                    className="block text-sm font-medium text-purple-900"
                  >
                    Jurusan
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    </div>
                    <input
                      id="jurusan"
                      name="jurusan"
                      type="text"
                      required
                      value={formData.jurusan}
                      onChange={handleChange}
                      className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border-0 bg-white/80 text-purple-900 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-purple-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                      placeholder="Masukkan Jurusan"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="angkatan"
                    className="block text-sm font-medium text-purple-900"
                  >
                    Angkatan
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    </div>
                    <select
                      id="angkatan"
                      name="angkatan"
                      required
                      value={formData.angkatan}
                      onChange={handleChange}
                      className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border-0 bg-white/80 text-purple-900 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-purple-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      <option value="">Pilih Angkatan</option>
                      {generateAngkatanOptions().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 sm:py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Memproses..." : "Simpan & Lanjutkan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IdentityPage;
