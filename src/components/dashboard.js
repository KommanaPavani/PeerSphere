import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        video: null,
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle file upload
    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            video: e.target.files[0],
        }));
    };

    // Submit form
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Unauthorized! Please log in.");
            navigate("/");
            return;
        }

        const uploadData = new FormData();
        uploadData.append("name", formData.name);
        uploadData.append("description", formData.description);
        uploadData.append("video", formData.video);

        try {
            await axios.post("http://localhost:5000/upload", uploadData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Video uploaded successfully!");
            setShowForm(false);
        } catch (error) {
            console.error("Error uploading video:", error);
            alert("Failed to upload video.");
        }
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <button onClick={() => setShowForm(true)}>Upload</button>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button>Browse</button>
            </div>

            <div className="main-content">
                <div className="dashboard-header">
                    <button onClick={handleLogout}>Logout</button>
                </div>

                <h1>Welcome to the Dashboard</h1>

                {showForm && (
                    <div className="upload-form-container">
                        <h2>Upload Video</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Video:</label>
                                <input
                                    type="file"
                                    name="video"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                        <button onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
