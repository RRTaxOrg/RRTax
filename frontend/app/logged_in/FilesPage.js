import { useState } from 'react';

export default function FilesPage() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="main-content flex flex-col min-h-screen bg-gray-50 mt-20 mb-20">
      <div className="w-full h-full flex-grow p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-customBlue mb-4">File Viewer</h1>
        <p className="text-gray-700 mb-4">Here you can manage your files based on your scheduled appointments.</p>
        <div className="files-page-container">
          <div className="files"></div>
          <div className="files-buttons">
            <button>Upload Files</button>
            <button onClick={toggleDropdown}>View Files</button>
          </div>
          <div className={`files-dropdown ${showDropdown ? 'show' : ''}`}>
            <a href="#">Tax Return 2023.pdf</a>
            <a href="#">Tax Return 2022.pdf</a>
            <a href="#">Notice of Assessment 2023.pdf</a>
          </div>
        </div>
      </div>
    </div>
  );
}