// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadResume from "./components/UploadResume";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ResumeListPage from "./components/ResumeListPage";


function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-resumes" element={<ResumeListPage />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
   
  );
}

export default App;
