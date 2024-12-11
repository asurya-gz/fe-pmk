"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 border border-purple-200">
        <p className="text-purple-900 font-semibold">{label}</p>
        <p className="text-purple-700">
          Jumlah Vote:{" "}
          <span className="font-bold text-purple-800">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ResponsiveChart = ({ data }) => {
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) {
        // Mobile
        setChartHeight(250);
      } else if (window.innerWidth < 1024) {
        // Tablet
        setChartHeight(300);
      } else {
        // Desktop
        setChartHeight(400);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="nama"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{
              fontSize: window.innerWidth < 640 ? 10 : 12,
              fill: "#4B5563",
            }}
          />
          <YAxis
            tick={{
              fontSize: window.innerWidth < 640 ? 10 : 12,
              fill: "#4B5563",
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(128, 90, 213, 0.1)" }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              paddingTop: "10px",
              fontSize: window.innerWidth < 640 ? "12px" : "14px",
            }}
          />
          <Bar
            name="Jumlah Vote"
            dataKey="votes"
            fill="#8854d8"
            barSize={window.innerWidth < 640 ? 20 : 30}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DashboardContent = () => {
  // State for total registered voters, candidates, and voting data
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [votingData, setVotingData] = useState([]);
  const [votingStatus, setVotingStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch semua data yang diperlukan
        const [
          votersResponse,
          candidatesResponse,
          votesResponse,
          votingResponse,
        ] = await Promise.all([
          axios.get("https://be-pmk-production.up.railway.app/api/all-voters"),
          axios.get("https://be-pmk-production.up.railway.app/api/candidate"),
          axios.get("https://be-pmk-production.up.railway.app/votes/get-all"),
          axios.get("https://be-pmk-production.up.railway.app/api/voting"),
        ]);

        setTotalVoters(votersResponse.data.length);
        const candidates = candidatesResponse.data.candidates;
        setTotalCandidates(candidates.length);
        setVotingStatus(votingResponse.data.status);

        // Hitung jumlah votes untuk setiap kandidat
        const voteCount = new Map();
        votesResponse.data.votes.forEach((vote) => {
          const candidateId = vote.candidate_id;
          voteCount.set(candidateId, (voteCount.get(candidateId) || 0) + 1);
        });

        // Gabungkan data kandidat dengan jumlah votes
        const votingDataWithVotes = candidates.map((candidate) => ({
          nama: candidate.name,
          votes: voteCount.get(candidate.id) || 0,
        }));

        setVotingData(votingDataWithVotes);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Determine status display and color
  const getStatusDisplay = () => {
    switch (votingStatus.toLowerCase()) {
      case "berlangsung":
        return {
          text: "Sedang Berlangsung",
          color: "text-green-600",
        };
      case "selesai":
        return {
          text: "Telah Selesai",
          color: "text-blue-600",
        };
      case "tutup":
        return {
          text: "Ditutup",
          color: "text-gray-600",
        };
      default:
        return {
          text: "Status Tidak Diketahui",
          color: "text-orange-600",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-900 mb-4">Dashboard</h1>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-purple-800">
            Total Kandidat
          </h2>
          {loading ? (
            <p className="text-3xl font-bold text-purple-600 animate-pulse">
              Memuat...
            </p>
          ) : error ? (
            <p className="text-lg font-medium text-red-600">{error}</p>
          ) : (
            <p className="text-3xl font-bold text-purple-600">
              {totalCandidates}
            </p>
          )}
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-purple-800">
            Pemilih Terdaftar
          </h2>
          {loading ? (
            <p className="text-3xl font-bold text-purple-600 animate-pulse">
              Memuat...
            </p>
          ) : error ? (
            <p className="text-lg font-medium text-red-600">{error}</p>
          ) : (
            <p className="text-3xl font-bold text-purple-600">{totalVoters}</p>
          )}
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-purple-800">
            Status Pemilihan
          </h2>
          {loading ? (
            <p className="text-lg font-medium text-purple-600 animate-pulse">
              Memuat...
            </p>
          ) : error ? (
            <p className="text-lg font-medium text-red-600">{error}</p>
          ) : (
            <p className={`text-lg font-medium ${statusDisplay.color}`}>
              {statusDisplay.text}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-purple-800 mb-4">
          Hasil Voting Kandidat
        </h2>
        <div className="w-full overflow-x-auto">
          {loading ? (
            <div className="animate-pulse flex items-center justify-center h-[300px] bg-gray-50 rounded">
              <div className="text-gray-400">Memuat data...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px] bg-red-50 rounded">
              <div className="text-red-500">{error}</div>
            </div>
          ) : (
            <ResponsiveChart data={votingData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
