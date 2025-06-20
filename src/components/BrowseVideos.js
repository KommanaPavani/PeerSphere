import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BrowseVideos.css';

function BrowseVideos() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/videos')
      .then((res) => res.json())
      .then((data) => setVideos(data.videos || []))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  return (
    <div className="browse-container">
      <h2>All Courses</h2>
      <div className="videos-grid">
        {videos.length === 0 ? (
          <p>No videos available.</p>
        ) : (
          videos.map((video) => (
            <div
              className="video-card"
              key={video._id}
              onClick={() => handleVideoClick(video._id)}
            >
              <img
                src={`http://localhost:5000/${(video.imagePath || '').replaceAll('\\', '/')}`}
                alt={video.name}
                className="video-image"
              />
              <h4>{video.name}</h4>
             
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BrowseVideos;
