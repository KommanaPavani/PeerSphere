import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from './components/signup';
import LoginForm from './components/loginform';
import Dashboard from './components/dashboard';
import Profile from './components/Profile';
import UploadedVideos from "./components/UploadedVideos";
import BrowseVideos from "./components/BrowseVideos";
import VideoDetails from "./components/VideoDetails";
import UploadCourse from "./components/UploadCourse";
function App() {
  return (
     <Router>
     <Routes>
     <Route path="/" element={<LoginForm />} />
     <Route path="/signup" element={<SignupForm />}/>
       <Route path="/dashboard" element={<Dashboard />}>
         <Route path="upload" element={<UploadCourse />} />
         <Route path="browse" element={<BrowseVideos />} />
       </Route>
       <Route path="/video/:videoId" element={<VideoDetails />} />
       <Route path="/profile" element={<Profile />} />
     </Routes>
   </Router>
  );
}

export default App;