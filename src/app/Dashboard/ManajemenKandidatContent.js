import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, Plus, Eye, Search } from "lucide-react";
import DetailCandidateModal from "./components/DetailCandidateModal";
import AddCandidateModal from "./components/AddCandidateModal";

const ManajemenKandidatContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailCandidate, setSelectedDetailCandidate] = useState(null);

  // Fetch candidates data
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://be-pmk-production.up.railway.app/api/candidate"
      );
      setCandidates(response.data.candidates);
    } catch (err) {
      setError("Failed to fetch candidates data");
      console.error("Error fetching candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter((candidate) =>
    Object.values(candidate)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleShowDetail = (candidate) => {
    setSelectedDetailCandidate(candidate);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-purple-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-900 mb-2">
          Manajemen Kandidat
        </h1>
        <p className="text-purple-600">
          Total Kandidat: {filteredCandidates.length}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari kandidat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Kandidat
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                Visi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-purple-100">
            {filteredCandidates.map((candidate, index) => (
              <tr
                key={candidate.id}
                className={index % 2 === 0 ? "bg-white" : "bg-purple-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {candidate.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {candidate.visions[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShowDetail(candidate)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors duration-200"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Apakah Anda yakin ingin menghapus kandidat ini?"
                          )
                        ) {
                          axios
                            .delete(
                              `https://be-pmk-production.up.railway.app/api/candidate/${candidate.id}`
                            )
                            .then(() => fetchCandidates())
                            .catch((err) => {
                              console.error("Error deleting candidate:", err);
                              alert("Failed to delete candidate");
                            });
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors duration-200"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <AddCandidateModal
          onClose={() => setIsAddModalOpen(false)}
          onAddCandidate={fetchCandidates}
        />
      )}

      {isDetailModalOpen && selectedDetailCandidate && (
        <DetailCandidateModal
          candidate={selectedDetailCandidate}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManajemenKandidatContent;
