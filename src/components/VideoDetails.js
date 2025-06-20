import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VideoDetails.css';

function VideoDetails() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [showVideo, setShowVideo] = useState(false); // Toggle for video display

  useEffect(() => {
    axios.get(`http://localhost:5000/videos/${videoId}`)
      .then((res) => setVideo(res.data.video))
      .catch((err) => console.error('Error fetching video:', err));
  }, [videoId]);

  const handleBack = () => navigate('/dashboard/browse');

  const toggleVideo = () => setShowVideo(!showVideo);

  if (!video) return <p>Loading...</p>;

  return (
    <div className="video-details-container">
      <button className="nav-button" onClick={handleBack}>← Back to Browse</button>

      <h2 className="video-details-title">{video.name}</h2>

      {video.imagePath && (
        <img
          src={`http://localhost:5000/${video.imagePath}`}
          alt="Thumbnail"
          className="video-details-thumbnail"
        />
      )}

      <p className="video-details-description">{video.description}</p>

      {video.videoPath && (
        <button className="show-video-button" onClick={toggleVideo}>
          {showVideo ? 'Hide Video' : 'Show Video'}
        </button>
      )}

      {showVideo && video.videoPath && (
        <video className="video-player" controls>
          <source src={`http://localhost:5000/${video.videoPath}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export default VideoDetails;
