import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../UploadResume.css';

function ResumeListPage() {
  const location = useLocation();
  const { resumes: initialResumes } = location.state || { resumes: [] };

  const [resumes, setResumes] = useState(initialResumes);
  const [selected, setSelected] = useState([]);
  const [enableSelection, setEnableSelection] = useState(false); // ✅ Toggle for checkbox mode

  const toggleSelect = (filename) => {
    setSelected((prev) =>
      prev.includes(filename)
        ? prev.filter((f) => f !== filename)
        : [...prev, filename]
    );
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return alert("Please select at least one resume to delete.");
    const email = localStorage.getItem("email");
    if (!email) return alert("User not authenticated.");

    try {
      const response = await fetch(
        'https://mosjf1wu16.execute-api.ap-south-1.amazonaws.com/dev/delete-resumes',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, filenames: selected }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Deleted successfully.");
        setResumes((prev) => prev.filter((f) => !selected.includes(f)));
        setSelected([]);
      } else {
        alert(result.error || "Failed to delete resumes.");
      }
    } catch (error) {
      console.error("Deletion failed:", error);
      alert("An error occurred during deletion.");
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-red-700">Your Uploaded Resumes</h2>

      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={enableSelection}
            onChange={() => setEnableSelection((prev) => !prev)}
          />
          <span>Enable Selection Mode</span>
        </label>
      </div>

      {resumes.length > 0 ? (
        <>
          <ul className="pl-6 space-y-2">
            {resumes.map((filename, index) => (
              <li
                key={index}
                className={`flex items-center space-x-2 cursor-pointer px-2 py-1 rounded ${
                  selected.includes(filename)
                    ? 'bg-blue-100'
                    : 'hover:bg-gray-100'
                }`}
              >
                {enableSelection && (
                  <input
                    type="checkbox"
                    checked={selected.includes(filename)}
                    onChange={() => toggleSelect(filename)}
                  />
                )}
                <span onClick={() => !enableSelection && toggleSelect(filename)}>
                  {filename}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-x-4">
            {enableSelection && (
              <button
                onClick={deleteSelected}
                className="login-container"
              >
                Delete Selected
              </button>
            )}
            <button
              className="login-container"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">No resumes found.</p>
          <button
            className="login-container"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  </div>
  )
}

export default ResumeListPage;
