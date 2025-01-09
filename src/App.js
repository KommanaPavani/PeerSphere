import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from './components/signup';
import LoginForm from './components/loginform';
import Dashboard from './components/dashboard';
import Profile from './components/Profile';
import UploadedVideos from "./components/UploadedVideos";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />}/>
        {/* Add route for video upload */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/uploaded-videos" element={<UploadedVideos />} />
      </Routes>
    </Router>
  );
}

export default App;