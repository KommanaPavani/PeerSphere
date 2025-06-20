import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [userVideos, setUserVideos] = useState([]);
    const [showVideos, setShowVideos] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
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

                setUserDetails(response.data.user);
                setUserVideos(response.data.videos);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                alert("Failed to fetch user profile. Please log in again.");
                navigate("/");
            }
        };

        fetchUserProfile();
    }, [navigate]);

    return (
        <div className="profile-page">
            <h1>Profile</h1>
            {userDetails && (
                <div className="user-details">
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                </div>
            )}

            <button className="profile-button" onClick={() => setShowVideos(!showVideos)}>
                {showVideos ? "Hide My Videos" : "Show My Videos"}
            </button>

            {showVideos && (
                <div className="uploaded-videos-section">
                    <h2>My Uploaded Courses</h2>
                    {userVideos.length > 0 ? (
                        <ul className="video-list">
                            {userVideos.map((video) => (
                                <li key={video._id}>
                                    <p><strong>Name:</strong> {video.name}</p>
                                    <p><strong>Description:</strong> {video.description}</p>

                                    <img
                                        src={`http://localhost:5000/${video.imagePath}`}
                                        alt={video.name}
                                        width="300"
                                        style={{ marginBottom: "10px" }}
                                    />

                                    {video.videoPath ? (
                                        <video
                                            src={`http://localhost:5000/${video.videoPath}`}
                                            controls
                                            width="300"
                                        />
                                    ) : (
                                        <p style={{ color: "gray" }}><em>Video not uploaded</em></p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No videos uploaded yet.</p>
                    )}
                </div>
            )}

            <button name="back" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
    );
};

export default Profile;
