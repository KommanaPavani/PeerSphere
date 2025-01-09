import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadedVideos.css";

const UploadedVideos = () => {
    const navigate = useNavigate();
    const [userVideos, setUserVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    alert("Unauthorized! Please log in.");
                    navigate("/");
                    return;
                }

                const response = await axios.get("http://localhost:5000/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserVideos(response.data.videos);
            } catch (error) {
                console.error("Error fetching videos:", error);
                alert("Failed to fetch videos. Please log in again.");
                navigate("/");
            }
        };

        fetchVideos();
    }, [navigate]);

    return (
        <div className="uploaded-videos-page">
            <h1>Uploaded Videos</h1>
            {userVideos.length > 0 ? (
                <ul className="video-list">
                    {userVideos.map((video) => (
                        <li key={video._id}>
                            <p><strong>Name:</strong> {video.name}</p>
                            <p><strong>Description:</strong> {video.description}</p>
                            <video
                                src={`http://localhost:5000/${video.videoPath}`}
                                controls
                                width="300"
                            ></video>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No videos uploaded yet.</p>
            )}
            <button onClick={() => navigate("/profile")}>Back to Profile</button>
        </div>
    );
};

export default UploadedVideos;
