import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const UploadCourse = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    imagePreview: null,
    video: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      video: e.target.files[0],
    }));
  };

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
    uploadData.append("image", formData.image);
    if (formData.video) {
      uploadData.append("video", formData.video);
    }

    try {
      await axios.post("http://localhost:5000/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Course uploaded successfully!");
      navigate("/dashboard/browse");
    } catch (error) {
      console.error("Error uploading course:", error);
      alert("Failed to upload course.");
    }
  };

  return (
  <div className="upload-page-container">  {/* NEW OUTER CONTAINER */}
    <div className="upload-form-container">
      <h2>Upload Course</h2>

      <div style={{ marginBottom: "20px" }}>
        {formData.imagePreview ? (
          <img
            src={formData.imagePreview}
            alt="Course Preview"
            style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
          />
        ) : (
          <p className="no-image-text">No image selected</p>
        )}
      </div>

      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <div>
          <label>Course Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <div>
          <label>Course Title:</label>
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
          <label>Optional Video Upload:</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
);

};

export default UploadCourse;
