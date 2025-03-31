'use client';

import { useState, useEffect } from 'react';
import '../../styles/FilesPage.css';

export default function FilesPage() {
  const [files, setFiles] = useState({ t4_t4a: [], education: [], other: [] });
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('t4_t4a');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Hook for getting files 
  useEffect(() => {
    fetchFiles();
  }, []);

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('rrtaxtoken');
      
      if (!token) {
        setError("Not authenticated. Please log in again.");
        return;
      }
      
      console.log("Fetching files using token", token);
      const response = await fetch(`http://localhost:3001/api/files?token=${token}`);
      const data = await response.json();
      
      console.log("Files response:", data);
      
      if (data.code === "0") {
        setFiles(data.files || { t4_t4a: [], education: [], other: [] });
      } else if (data.code === "2") {
        setError("Your session has expired. Please log in again.");
      } else {
        setError("Failed to fetch files");
        console.error("Failed to fetch files:", data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  
  // Upload files
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    const token = localStorage.getItem('userRRTAXToken');
    if (!token) {
      setError("Not authenticated. Please log in again.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('token', token);
    
    try {
      const response = await fetch('http://localhost:3001/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.code === "0") {
        setMessage("File uploaded successfully");
        setSelectedFile(null);
        // Reset file input
        document.getElementById('file-upload').value = '';
        // Refresh files list
        fetchFiles();
      } else if (data.code === "2") {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(`Failed to upload file: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file download
  const handleDownload = async (fileId) => {
    const token = localStorage.getItem('userRRTAXToken');
    if (!token) {
      setError("Not authenticated. Please log in again.");
      return;
    }

    if (!fileId) {
      console.error("Missing file ID for download");
      setError("Cannot download file: missing file identifier");
      return;
    }

    console.log(`Downloading file with ID: ${fileId}`);
    
    try {
      window.open(`http://localhost:3001/api/files/download?file_id=${fileId}&token=${token}`);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Error downloading file");
    }
  };
  
  // Delete file
  const handleDelete = async (fileId) => {
    const token = localStorage.getItem('userRRTAXToken');
    if (!token) {
      setError("Not authenticated. Please log in again.");
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/files/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: fileId,
          token: token,
        }),
      });

      const data = await response.json();
      
      if (data.code === "0") {
        setMessage("File deleted successfully");
        // Refresh files list
        fetchFiles();
      } else {
        setError(`Failed to delete file: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Error deleting file");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Render files list for a category
  const renderFilesList = (filesList, title) => {
    if (!filesList || filesList.length === 0) {
      return (
        <div className="category-section">
          <h3>{title}</h3>
          <p className="no-files">No files uploaded in this category</p>
        </div>
      );
    }

    return (
      <div className="category-section">
        <h3>{title}</h3>
        <ul className="files-list">
          {filesList.map((file, index) => (
            <li key={file.id || index} className="file-item">
              <span>{file.name}</span>
              <div className="file-actions">
                <button 
                  onClick={() => handleDownload(file.id)}
                  className="download-btn"
                >
                  Download
                </button>
                <button 
                  onClick={() => handleDelete(file.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="main-content flex flex-col min-h-screen bg-gray-50 mt-20 mb-20">
      <div className="w-full h-full flex-grow p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-customBlue mb-4">File Manager</h1>
        <p className="text-gray-700 mb-4">Here you can manage your tax documents and important files.</p>
        
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        
        <div className="upload-section">
          <h3>Upload New File</h3>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="t4_t4a">T4/T4A</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="file-upload">Select File:</label>
              <input 
                type="file" 
                id="file-upload" 
                onChange={handleFileSelect} 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !selectedFile}
              className="upload-button"
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </form>
        </div>
        
        <div className="files-container mt-5">
          {renderFilesList(files.t4_t4a, 'T4/T4A Documents')}
          {renderFilesList(files.education, 'Education Documents')}
          {renderFilesList(files.other, 'Other Documents')}
        </div>
      </div>
    </div>
  );
}