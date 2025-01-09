import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);

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

            <button onClick={() => navigate("/uploaded-videos")}>Uploaded Videos</button>
            <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
    );
};

export default Profile;
