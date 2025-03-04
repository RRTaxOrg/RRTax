'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import VerticalNavBar from '../components/VerticalNavBar';
import '../styles/LoggedInPage.css';

export default function LoggedInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    if (!token) {
      console.error("Token is missing");
      router.push('/');
      return;
    }

    if (!email) {
      console.error("Email is missing");
      router.push('/');
      return;
    }

    // Get user data including uid from email
    fetchUserData();
  }, [token, email, router]);

  // Function to fetch user data using the email
  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log("Fetching user data for email:", email);
      
      const response = await fetch(`http://localhost:3001/getUserByEmail?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      console.log("User data response:", data);
      
      if (data.code === "0" && data.user) {
        setUser(data.user);
        console.log("User found with UID:", data.user.uid);
        // Now fetch appointments for this user
        fetchAppointments(data.user.uid);
      } else {
        setError("Could not retrieve user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Error retrieving user data");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch appointments for a user
  const fetchAppointments = async (userId) => {
    if (!userId) {
      console.error("Cannot fetch appointments without user ID");
      return;
    }

    try {
      console.log("Fetching appointments for user ID:", userId);
      const response = await fetch(`http://localhost:3001/appointments/?user_id=${userId}`);
      const data = await response.json();
      
      console.log("Appointments response:", data);
      
      if (data.code === "0") {
        setAppointments(data.appointments || []);
      } else {
        console.error("Failed to fetch appointments:", data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Function to create a new appointment
  const handleCreateAppointment = async () => {
    if (!time) {
      setError("Please select a time for your appointment");
      return;
    }

    if (!user || !user.uid) {
      setError("User data not available");
      return;
    }

    try {
      setLoading(true);
      
      // Convert selected time to Unix timestamp
      const unixTime = Math.floor(new Date(time).getTime() / 1000);
      
      // Generate a unique appointment ID
      // We'll use a numeric ID since the column might be INTEGER type
      const appointmentId = Date.now();
      
      console.log("Creating appointment with user_id:", user.uid);

      const response = await fetch('http://localhost:3001/appointment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(user.uid), // Ensure it's an integer
          time: String(unixTime),      // Send as string to handle TEXT column type
          appId: appointmentId         // This might be used as an INTEGER
        }),
      });
      
      const data = await response.json();
      console.log("Appointment creation response:", data);
      
      if (data.code === "0") {
        console.log("Appointment created successfully");
        setTime(''); // Reset time input
        // Refresh appointments list
        fetchAppointments(user.uid);
        setError(''); // Clear any errors
      } else {
        setError(`Failed to create appointment: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError("Error creating appointment");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/logout/?token=${token}`);
      const data = await response.json();
      
      if (data.code === "0") {
        console.log("Logged out successfully");
        router.push('/');
      } else {
        setError("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Error during logout");
    } finally {
      setLoading(false);
    }
  };

  // Format a timestamp based on its type (it might be stored as TEXT in the database)
  const formatAppointmentTime = (timestamp) => {
    // If the timestamp is a string, try to parse it
    const time = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    // If we have a valid number, format it as a date
    if (!isNaN(time)) {
      return new Date(time * 1000).toLocaleString();
    }
    // If timestamp is already a formatted string or parsing failed, return it as is
    return timestamp;
  };

  return (
    <div className="flex">
      <VerticalNavBar />
      <div className="main-content flex flex-col min-h-screen bg-gray-50 mt-20 mb-20">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-customBlue mb-4">Your Dashboard</h1>
          
          {user ? (
            <p className="text-gray-700 mb-4">Welcome, {user.username || email}</p>
          ) : loading ? (
            <p className="text-gray-500 text-center">Loading user data...</p>
          ) : (
            <p className="text-red-500">Could not load user data</p>
          )}
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-customBlue mb-2">Book an Appointment</h2>
            <div className="flex flex-col space-y-2">
              <input
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading || !user}
              />
              <button
                onClick={handleCreateAppointment}
                className="w-full px-4 py-2 text-white bg-customBlue rounded-md disabled:bg-gray-300"
                disabled={loading || !user || !time}
              >
                {loading ? 'Processing...' : 'Create Appointment'}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-customBlue mb-2">Your Appointments</h2>
            {loading ? (
              <p className="text-gray-500 text-center">Loading appointments...</p>
            ) : appointments && appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Appointment ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr key={appointment.appointment_id || index}>
                        <td>{formatAppointmentTime(appointment.time)}</td>
                        <td>{appointment.appointment_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No appointments scheduled</p>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-white bg-red-500 rounded-md"
            disabled={loading}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}