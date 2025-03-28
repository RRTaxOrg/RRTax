'use client'

import React, { useState, useEffect } from 'react';
import './FileUploadPage.css'; // Import the CSS file as a regular import, not as a module

export default function FilesPage({ user }) {
  // now insted of just displaying all files as one i will make a section for each
  const [files, setFiles] = useState({ t4_t4a: [], education: [], other: [] });
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('t4_t4a');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // hook for getting files 
  useEffect(() => {
    if (user && user.uid) {
      fetchFiles();
    }
  }, [user]);
  // fecth files function gets all files from back end 
  // from here this is just a simple fetch we still use the uid and pass it in url but that wil chnge later 
  const fetchFiles = async () => {
    if (!user || !user.uid) {
      console.error("Cannot fetch files without user ID");
      return;
    }
    // get files 
    try {
      setLoading(true);
      console.log("Fetching files for user ID:", user.uid);
      const response = await fetch(`http://localhost:3001/api/files?user_id=${user.uid}`);
      const data = await response.json();
      
      console.log("Files response:", data);
      // validate check err codes
      if (data.code === "0") {
        // Log each file to verify we have ids
        if (data.files) {
          Object.keys(data.files).forEach(category => {
            data.files[category].forEach(file => {
              console.log(`${category} file:`, file);
              if (!file.id) {
                console.warn(`Missing ID for file: ${file.name}`);
              }
            });
          });
        }
        // on success set files 
        setFiles(data.files || { t4_t4a: [], education: [], other: [] });
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
  // upload files
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    if (!user || !user.uid) {
      setError("User data not available");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('user_id', user.uid);
    // send file to be uploaded
    try {
      const response = await fetch('http://localhost:3001/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      // validate codes 
      if (data.code === "0") {
        setMessage("File uploaded successfully");
        setSelectedFile(null);
        // Reset file input
        document.getElementById('file-upload').value = '';
        // Refresh files list
        fetchFiles();
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
  // handle the download this gets the file from server and diwnloads it usig window.open
  // uses the file id how safe is that bruh who knows 
  const handleDownload = async (fileId) => {
    // err checks
    if (!user || !user.uid) {
      setError("User data not available");
      return;
    }

    if (!fileId) {
      console.error("Missing file ID for download");
      setError("Cannot download file: missing file identifier");
      return;
    }

    console.log(`Downloading file with ID: ${fileId}`);
    // get file to download
    try {
      // doanload
      window.open(`http://localhost:3001/api/files/download?file_id=${fileId}&user_id=${user.uid}`);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Error downloading file");
    }
  };
  // delete the file 
  // this uses the file id to delete the file
  const handleDelete = async (fileId) => {
    if (!user || !user.uid) {
      setError("User data not available");
      return;
    }
  
    try {
      // del file 
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/files/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: fileId,
          user_id: user.uid,
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


  // render the files 
  const renderFilesList = (filesList, title) => {
    // if no files 
    if (!filesList || filesList.length === 0) {
      return (
        <div className="category-section">
          <h3>{title}</h3>
          <p className="no-files">No files uploaded in this category</p>
        </div>
      );
    }
// else 
    return (
      // render all files sepeated into sections 
      <div className="category-section">
        <h3>{title}</h3>
        <ul className="files-list">
          {filesList.map((file, index) => {
            // Debug logging
            console.log(`Rendering file ${index} in ${title}:`, file);
            
            // Make sure we have a valid ID
            const fileId = file.id || file.rowid || file.file_id; 
            
            if (!fileId) {
              console.error(`No ID found for file: ${file.name}`, file);
            }
            // render each file with download and delete buttons
            return (
              <li key={fileId || `file-${index}-${Math.random().toString(36).substring(2, 9)}`} className="file-item">
                <span>{file.name}</span>
                <div className="file-actions">
                  <button 
                    onClick={() => {
                      console.log(`Attempting to download file: ${file.name}, ID: ${fileId}`);
                      handleDownload(fileId);
                    }} 
                    className="download-btn"
                    disabled={!fileId}
                    title={fileId ? `Download ${file.name} (ID: ${fileId})` : "Cannot download: Missing file ID"}
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => {
                      console.log(`Attempting to delete file: ${file.name}, ID: ${fileId}`);
                      handleDelete(fileId);
                    }}
                    className="delete-btn"
                    disabled={!fileId}
                    title={fileId ? `Delete ${file.name} (ID: ${fileId})` : "Cannot delete: Missing file ID"}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  // upluad secction mostly teh same as before but more UI and error handling
  return (
    <div className="files-page-container">
      <h2>Files Management</h2>
      
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
      {/* render files  */}
      <div className="files-container">
        {renderFilesList(files.t4_t4a, 'T4/T4A Documents')}
        {renderFilesList(files.education, 'Education Documents')}
        {renderFilesList(files.other, 'Other Documents')}
      </div>
    </div>
  );
}