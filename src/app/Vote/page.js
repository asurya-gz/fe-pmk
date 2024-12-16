"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Check, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const VotingStatus = {
  BERLANGSUNG: "berlangsung",
  TUTUP: "tutup",
  SELESAI: "selesai",
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
        "Proses Pemilihan Raya (Pemira) telah usai. Terima kasih atas partisipasi Anda dalam demokrasi kampus.",
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

const VotingPageContent = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(null);
  const [nim, setNim] = useState("");
  const [votingStatus, setVotingStatus] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch voting status
        const statusResponse = await axios.get(
          "https://be-pmk-production.up.railway.app/api/voting"
        );
        setVotingStatus(statusResponse.data.status);

        // Fetch candidates
        const candidatesResponse = await axios.get(
          "https://be-pmk-production.up.railway.app/api/candidate"
        );
        setCandidates(candidatesResponse.data.candidates);

        // Check if user has already voted
        const nimFromUrl = searchParams.get("nim");
        if (nimFromUrl) {
          const voteCheckResponse = await axios.get(
            `https://be-pmk-production.up.railway.app/votes/${nimFromUrl}`
          );

          if (voteCheckResponse.data.voted) {
            setError("Anda sudah melakukan voting sebelumnya.");
            setTimeout(() => {
              router.push("/Identitas");
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setVotingStatus(VotingStatus.TUTUP);
        }
      }
    };

    const nimFromUrl = searchParams.get("nim");
    if (!nimFromUrl) {
      router.push("/Identitas");
      return;
    }

    setNim(nimFromUrl);
    fetchData();
  }, [searchParams, router]);

  const handleVote = async () => {
    if (!selectedCandidate) return;

    setLoading(true);
    setError(null);

    try {
      // Submit the vote
      const response = await axios.post(
        `https://be-pmk-production.up.railway.app/votes/${nim}`,
        {
          candidate_id: selectedCandidate,
        }
      );

      if (response.data.message === "Vote added successfully") {
        setShowSuccessModal(true);
        setTimeout(() => {
          router.push("/Identitas");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      setError(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memproses suara Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col justify-center items-center px-4 text-center">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-xl shadow-xl ring-1 ring-purple-900/5 max-w-md">
          <div className="flex justify-center mb-6">
            <Lock className="h-16 w-16 text-red-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-red-900 mb-4">
            Gagal Melakukan Voting
          </h2>
          <p className="text-sm sm:text-base text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (votingStatus === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <p className="text-purple-600">Memuat status pemilihan...</p>
      </div>
    );
  }

  if (
    votingStatus === VotingStatus.TUTUP ||
    votingStatus === VotingStatus.SELESAI
  ) {
    return <StatusDisplay status={votingStatus} />;
  }

  const selectedCandidateData = candidates.find(
    (c) => c.id === selectedCandidate
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl p-6 shadow-xl max-w-md w-full animate-fade-in">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="bg-green-500 rounded-full p-3">
                <Check className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-xl font-bold text-gray-900">
                Terima Kasih Atas Partisipasi Anda!
              </h3>
              <div className="mt-4 flex items-center justify-center space-x-4">
                <img
                  src={`https://be-pmk-production.up.railway.app/uploads/${selectedCandidateData?.image_path}`}
                  alt={selectedCandidateData?.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900">
                    Anda telah memilih:
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    {selectedCandidateData?.name}
                  </p>
                  <p className="text-sm text-gray-600">Calon Ketua PMK FSM</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">Tuhan Memberkati!</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-transparent animate-spin-slow"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-l from-white/30 to-transparent animate-spin-reverse-slow"></div>
            <div className="absolute inset-2 sm:inset-3">
              <img src="/logo.png" alt="Logo PMK" />
            </div>
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-purple-900">
            Pemilihan Ketua PMK FSM
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-purple-600 font-medium">
            Silakan pilih kandidat yang Anda dukung
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-lg ring-1 transition-all duration-200 cursor-pointer ${
                selectedCandidate === candidate.id
                  ? "ring-purple-500 ring-2"
                  : "ring-purple-900/5 hover:ring-purple-500"
              }`}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <div className="relative">
                {selectedCandidate === candidate.id && (
                  <div className="absolute -right-2 -top-2 bg-purple-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://be-pmk-production.up.railway.app/uploads/${candidate.image_path}`}
                    alt={candidate.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-purple-600">
                      Calon Ketua PMK FSM
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-purple-900">Visi:</h4>
                  <p className="mt-1 text-sm text-purple-600">
                    {candidate.visions[0]}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-purple-900">Misi:</h4>
                  <ul className="mt-1 text-sm text-purple-600 list-disc list-inside">
                    {candidate.missions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleVote}
            disabled={!selectedCandidate || loading}
            className={`px-8 py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 ${
              !selectedCandidate || loading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? "Memproses..." : "Kirim Suara"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrap the content in Suspense
const VotingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VotingPageContent />
    </Suspense>
  );
};

export default VotingPage;
