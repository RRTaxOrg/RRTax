'use client';

import { useState, useEffect } from 'react';

export default function AccountSettingsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    sinNumber: '',
    dateOfBirth: '',
    maritalStatus: '',
    numberOfChildren: '',
  });

  const [token, setToken] = useState(null);

  // Add useEffect to retrieve token and fetch data on component mount
  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('rrtaxtoken');
    console.log("Retrieved token from localStorage:", storedToken);
    
    if (storedToken) {
      setToken(storedToken);
    } else {
      setLoading(false);
      setError("No authentication token found. Please log in again.");
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token, ...formData }),
      });

      const data = await response.json();
      if (data.code === "0") {
        alert('Information saved successfully');
      } else {
        alert('Failed to save information');
      }
    } catch (error) {
      console.error('Error saving information:', error);
      alert('Error saving information');
    }
  };

  return (
    <div className="main-content flex flex-col min-h-screen bg-gray-50 mt-20 mb-20">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-customBlue mb-4">Account Settings</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">SIN Number</label>
            <input
              type="text"
              name="sinNumber"
              value={formData.sinNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Marital Status</label>
            <input
              type="text"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Number of Children</label>
            <input
              type="number"
              name="numberOfChildren"
              value={formData.numberOfChildren}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="w-full px-4 py-2 text-white bg-customBlue rounded-md"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}