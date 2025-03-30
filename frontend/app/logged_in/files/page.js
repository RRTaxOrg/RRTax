'use client';

import React, { useState, useEffect } from "react";
import "./FileUploadPage.css"; // Import the CSS file for styling

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("other");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({
    t4_t4a: [],
    education: [],
    other: [],
  });

  // Simulated user_id (replace with actual user authentication logic)
  const userId = "1"; // This should come from your authentication system

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("category", category);
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/api/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.code === "0") {
        setUploadStatus("File uploaded successfully!");
        fetchUploadedFiles(); // Refresh the list of uploaded files
      } else {
        setUploadStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file. Please try again.");
    }
  };

  // Fetch uploaded files
  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/files?user_id=${userId}`);
      const data = await response.json();

      if (data.code === "0") {
        setUploadedFiles(data.files);
      } else {
        console.error("Error fetching files:", data.message);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Fetch uploaded files on component mount
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  return (
    <div className="file-upload-page">
      <div className="file-upload-container">
        <h2>Upload File</h2>
        <div className="upload-form">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="t4_t4a">T4/T4A</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
          <button onClick={handleUpload} className="upload-button">
            Upload
          </button>
        </div>
        {uploadStatus && (
          <p
            className={`upload-status ${
              uploadStatus.includes("successfully") ? "success" : "error"
            }`}
          >
            {uploadStatus}
          </p>
        )}
        <h3>Uploaded Files</h3>
        <div className="uploaded-files">
          {Object.keys(uploadedFiles).every(
            (key) => uploadedFiles[key].length === 0
          ) ? (
            <p>No files uploaded yet.</p>
          ) : (
            <div className="file-categories">
              {Object.keys(uploadedFiles).map((category) => (
                <div key={category} className="file-category">
                  <h4>{category.toUpperCase().replace("_", "/")}</h4>
                  {uploadedFiles[category].length === 0 ? (
                    <p>No files in this category.</p>
                  ) : (
                    <ul>
                      {uploadedFiles[category].map((file) => (
                        <li key={file.id}>
                          {file.filename} (Uploaded on{" "}
                          {new Date(file.upload_date * 1000).toLocaleDateString()})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;