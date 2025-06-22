// src/components/UploadResume.js
import React, { useState, useEffect, useContext } from 'react';
import '../UploadResume.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';

function UploadResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [status, setStatus] = useState('');
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAtsResult(null);
    setStatus('');
  };

  const uploadFile = async () => {
    const userEmail = user?.email;
    if (!file || !jobDescription || !userEmail) {
      return alert("Please provide resume, job description, and ensure you're logged in.");
    }

    setUploading(true);
    setStatus("Uploading to server...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);
    formData.append("email", userEmail);

    try {
      const response = await fetch('https://mosjf1wu16.execute-api.ap-south-1.amazonaws.com/dev/upload-resume', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Uploaded! Analyzing...");
        pollForATSScore(result.filename, userEmail);
      } else {
        setStatus(`Upload failed: ${result.error}`);
      }

    } catch (err) {
      console.error("Upload error:", err);
      setStatus("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const pollForATSScore = async (filename,  userEmail, retries = 4) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(`https://mosjf1wu16.execute-api.ap-south-1.amazonaws.com/dev/get-ats-score?filename=${encodeURIComponent(filename)}&email=${encodeURIComponent(userEmail)}`);
        if (res.status === 200) {
          const data = await res.json();
          setAtsResult(data);
          setStatus("Analysis complete ✅");
          return;
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      setStatus(`Waiting for analysis... (${i + 1}/${retries})`);
    }
    setStatus("Analysis not available. Please try again later.");
  };

  const handleViewResumes = async () => {
    const email = user?.email;
    if (!email) return alert("Login required to view resumes.");

    try {
      const response = await fetch(`https://mosjf1wu16.execute-api.ap-south-1.amazonaws.com/dev/list-resumes?email=${email}`);
      const data = await response.json();

      if (data.resumes) {
        navigate("/my-resumes", { state: { resumes: data.resumes } });
      } else {
        alert("No resumes found or error occurred.");
      }
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      alert("Error fetching resumes.");
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="login-container">
      <div className="header">
        <h1>Smart Resume Checker</h1>
        <button onClick={handleLogout} className="transparent-btn logout-btn">
          Logout
        </button>
      </div>

      <textarea
        className="input-field"
        placeholder="Paste Job Description here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={4}
      />

      <input
        type="file"
        className="input-field"
        onChange={handleFileChange}
      />

      <button
        onClick={uploadFile}
        disabled={uploading}
        className="transparent-btn"
      >
        {uploading ? "Uploading..." : "Check Suitability"}
      </button>

      <button onClick={handleViewResumes} className="transparent-btn">
        View Uploaded Resumes
      </button>

      {status && <div className="status-text">{status}</div>}

      {atsResult && (
        <div className="result-box">
          <h2>ATS Score: {atsResult.ats_score}%</h2>
          <p><strong>Rating:</strong> {renderStars(atsResult.rating || 0)}</p>
          <p><strong>Matched Skills:</strong> {atsResult.matched_keywords.join(', ')}</p>
          {atsResult.suggested_keywords?.length > 0 && (
            <p><strong>Suggested Keywords:</strong> {atsResult.suggested_keywords.join(', ')}</p>
          )}
          <p><strong>Filename:</strong> {atsResult.filename}</p>
        </div>
      )}
    </div>
  );
}

export default UploadResume;
