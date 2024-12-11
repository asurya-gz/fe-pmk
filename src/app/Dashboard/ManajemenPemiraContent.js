"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import axios from "axios";

const useVotingStatus = () => {
  const [votingStatus, setVotingStatus] = useState("tutup");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVotingStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://be-pmk-production.up.railway.app/api/voting"
      );
      setVotingStatus(response.data.status);
      setError(null);
    } catch (err) {
      setError("Gagal memuat status voting");
      console.error("Error fetching voting status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotingStatus();
  }, []);

  const updateVotingStatus = async (newStatus) => {
    try {
      setLoading(true);
      const response = await axios.put(
        "https://be-pmk-production.up.railway.app/api/update-voting",
        {
          status: newStatus,
        }
      );

      if (response.data.message) {
        // Update local state only if the server update was successful
        setVotingStatus(response.data.status);
        setError(null);
      }
    } catch (err) {
      setError("Gagal mengupdate status voting");
      console.error("Error updating voting status:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetPemira = async () => {
    try {
      setLoading(true);

      // Pertama, lakukan reset data
      const resetResponse = await axios.post(
        "https://be-pmk-production.up.railway.app/api/reset-pemira"
      );

      // Kemudian, secara eksplisit update status menjadi 'tutup'
      const updateStatusResponse = await axios.put(
        "https://be-pmk-production.up.railway.app/api/update-voting",
        { status: "tutup" }
      );

      // Update status lokal
      setVotingStatus("tutup");
      setError(null);
    } catch (err) {
      setError("Gagal mereset Pemira");
      console.error("Error resetting Pemira:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    votingStatus,
    loading,
    error,
    updateVotingStatus,
    fetchVotingStatus,
    resetPemira,
  };
};

const ManajemenPemiraContent = () => {
  const { votingStatus, loading, error, updateVotingStatus, resetPemira } =
    useVotingStatus();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleMulaiPemira = () => {
    updateVotingStatus("berlangsung");
  };

  const handleAkhiriPemira = () => {
    updateVotingStatus("selesai");
  };

  const handleResetPemira = () => {
    setShowConfirmModal(true);
  };

  const confirmResetPemira = () => {
    resetPemira();
    setShowConfirmModal(false);
  };

  const cancelResetPemira = () => {
    setShowConfirmModal(false);
  };

  const renderStatusAlert = () => {
    if (loading) {
      return (
        <div className="flex items-center p-4 mb-6 rounded-lg border border-blue-500 bg-blue-50">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <p className="ml-2 text-blue-600">Memuat status Pemira...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center p-4 mb-6 rounded-lg border border-red-500 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="ml-2 text-red-600">{error}</p>
        </div>
      );
    }

    switch (votingStatus) {
      case "berlangsung":
        return (
          <div className="flex items-center p-4 mb-6 rounded-lg border border-yellow-500 bg-yellow-50">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="ml-2 text-yellow-600">Pemira sedang berlangsung</p>
          </div>
        );
      case "selesai":
        return (
          <div className="flex items-center p-4 mb-6 rounded-lg border border-green-500 bg-green-50">
            <AlertCircle className="h-5 w-5 text-green-600" />
            <p className="ml-2 text-green-600">Pemira telah selesai</p>
          </div>
        );
      default:
        return (
          <div className="flex items-center p-4 mb-6 rounded-lg border border-purple-500 bg-purple-50">
            <AlertCircle className="h-5 w-5 text-purple-600" />
            <p className="ml-2 text-purple-600">Pemira belum dimulai</p>
          </div>
        );
    }
  };

  const renderActionButton = () => {
    if (loading) {
      return (
        <button
          disabled
          className="w-full py-2 px-4 rounded-lg bg-gray-400 text-white font-medium cursor-not-allowed"
        >
          Memuat...
        </button>
      );
    }

    switch (votingStatus) {
      case "tutup":
        return (
          <button
            onClick={handleMulaiPemira}
            className="w-full py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200"
          >
            Mulai Pemira
          </button>
        );
      case "berlangsung":
        return (
          <button
            onClick={handleAkhiriPemira}
            className="w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
          >
            Akhiri Pemira
          </button>
        );
      case "selesai":
        return (
          <button
            onClick={handleResetPemira}
            className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
          >
            Reset Pemira
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-purple-900">
            Manajemen Pemira
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {renderStatusAlert()}

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Status Pemira:{" "}
                <span className="capitalize">{votingStatus}</span>
              </h3>
              <div className="mt-4">{renderActionButton()}</div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Konfirmasi Reset Pemira
            </h2>
            <p className="mb-6 text-gray-700">
              Apakah Anda yakin akan mereset Pemira? Seluruh data Pemira akan
              dibersihkan.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelResetPemira}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmResetPemira}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenPemiraContent;
