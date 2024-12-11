"use client";
import React, { useState } from "react";
import { Plus, X, FileUp } from "lucide-react";
import axios from "axios";

const AddCandidateModal = ({ onClose, onAddCandidate }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    position: "Calon Ketua PMK FSM",
    image: null,
    vision: "",
    mission: [""],
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCandidate((prev) => ({
          ...prev,
          image: file, // Store the actual file object
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateNewCandidateMission = (index, value) => {
    const updatedMissions = [...newCandidate.mission];
    updatedMissions[index] = value;
    setNewCandidate({ ...newCandidate, mission: updatedMissions });
  };

  const addMissionField = () => {
    setNewCandidate({
      ...newCandidate,
      mission: [...newCandidate.mission, ""],
    });
  };

  const handleAddCandidate = async () => {
    try {
      setIsLoading(true);

      // Create FormData for candidate creation (includes image)
      const formData = new FormData();
      formData.append("name", newCandidate.name);
      if (newCandidate.image) {
        formData.append("image", newCandidate.image);
      }

      // Step 1: Add candidate
      const candidateResponse = await axios.post(
        "http://localhost:4000/api/add-candidates",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const candidateId = candidateResponse.data.candidate.id;

      // Step 2: Add vision
      if (newCandidate.vision) {
        await axios.post("http://localhost:4000/api/visions", {
          candidateId: candidateId,
          vision: newCandidate.vision,
        });
      }

      // Step 3: Add missions
      const missionPromises = newCandidate.mission
        .filter((mission) => mission.trim() !== "") // Filter out empty missions
        .map((mission) =>
          axios.post("http://localhost:4000/api/missions", {
            candidateId: candidateId,
            mission: mission,
          })
        );

      await Promise.all(missionPromises);

      // Notify parent component and close modal
      onAddCandidate(candidateResponse.data.candidate);
      onClose();
    } catch (error) {
      console.error("Error adding candidate:", error);
      alert(
        `Error: ${error.response?.data?.message || "Failed to add candidate"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden text-gray-600">
        {/* Image Upload Section - Full width on mobile, 1/3 width on desktop */}
        <div className="w-full md:w-1/3 bg-purple-100 p-6 flex flex-col items-center justify-center">
          <div className="mb-4 w-full max-w-xs">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4 shadow-lg mx-auto"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <FileUp className="h-10 w-10 text-gray-500" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="mt-4 w-full bg-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer text-center block"
            >
              Unggah Foto
            </label>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-2/3 p-4 md:p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-purple-900">
              Tambah Kandidat
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Nama Kandidat
            </label>
            <input
              type="text"
              value={newCandidate.name}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Masukkan nama kandidat"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Visi
            </label>
            <textarea
              value={newCandidate.vision}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, vision: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Masukkan visi kandidat"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Misi
            </label>
            {newCandidate.mission.map((mission, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={mission}
                  onChange={(e) =>
                    updateNewCandidateMission(index, e.target.value)
                  }
                  className="w-full p-2 border rounded-lg mr-2"
                  placeholder={`Masukkan misi ${index + 1}`}
                />
              </div>
            ))}
            <button
              onClick={addMissionField}
              className="bg-purple-500 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Misi
            </button>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddCandidate}
              disabled={isLoading || !newCandidate.name || !newCandidate.vision}
              className={`bg-green-500 text-white px-4 py-2 rounded-lg w-full md:w-auto ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Menyimpan..." : "Simpan Kandidat"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
