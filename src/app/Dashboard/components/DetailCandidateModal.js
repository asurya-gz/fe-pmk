import React from "react";
import { X } from "lucide-react";

const DetailCandidateModal = ({ candidate, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-[90%] md:w-[80%] h-[80vh] bg-white backdrop-blur-lg rounded-xl shadow-xl ring-1 ring-purple-900/5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-purple-100 transition-colors duration-200 z-10"
        >
          <X className="h-5 w-5 text-purple-600" />
        </button>

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
          <div className="max-w-4xl mx-auto">
            {/* Candidate Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <img
                src={`https://be-pmk-production.up.railway.app/uploads/${candidate.image_path}`}
                alt={candidate.name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover ring-2 ring-purple-100"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-2">
                  {candidate.name}
                </h2>
                <p className="text-purple-600 font-medium mb-4">
                  Calon Ketua PMK FSM
                </p>
              </div>
            </div>

            {/* Visi & Misi Sections */}
            <div className="grid gap-8">
              {/* Visi Section */}
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-4">
                  Visi:
                </h3>
                <div className="bg-purple-50/50 rounded-lg p-4 ring-1 ring-purple-900/5">
                  <div className="space-y-3">
                    {candidate.visions.map((vision, index) => (
                      <p
                        key={index}
                        className="text-purple-700 leading-relaxed text-sm sm:text-base"
                      >
                        {vision}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Misi Section */}
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-4">
                  Misi:
                </h3>
                <div className="bg-purple-50/50 rounded-lg p-4 ring-1 ring-purple-900/5">
                  <div className="space-y-4">
                    {candidate.missions.map((mission, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-sm sm:text-base"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium text-sm">
                          {index + 1}
                        </div>
                        <p className="text-purple-700 leading-relaxed pt-0.5">
                          {mission}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCandidateModal;
