"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Download } from "lucide-react";

const DaftarPemilihContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/all-voters"
        );
        setVoters(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch voters");
        setLoading(false);
        console.error("Error fetching voters:", err);
      }
    };

    fetchVoters();
  }, []);

  // Filter voters based on search term
  const filteredVoters = voters.filter((voter) =>
    Object.values(voter).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleExport = () => {
    // Implement export functionality here
    // For CSV export example:
    const headers = ["Nama", "NIM", "Jurusan", "Angkatan"];
    const csvContent = [
      headers.join(","),
      ...filteredVoters.map((voter) =>
        [voter.nama, voter.nim, voter.jurusan, voter.angkatan].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "daftar-pemilih.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading voters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-900 mb-2">
          Daftar Pemilih
        </h1>
        <p className="text-purple-600">
          Total Pemilih: {filteredVoters.length}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari pemilih..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Download className="h-5 w-5 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                NIM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                Jurusan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                Angkatan
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-purple-100">
            {filteredVoters.map((voter, index) => (
              <tr
                key={voter.nim}
                className={index % 2 === 0 ? "bg-white" : "bg-purple-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {voter.nama}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {voter.nim}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {voter.jurusan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {voter.angkatan}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DaftarPemilihContent;
