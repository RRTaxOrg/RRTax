'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import VerticalNavBar from '../components/VerticalNavBar';
import LandingPage from './LandingPage';
import AppointmentsPage from './AppointmentsPage';
import FilesPage from './FilesPage';
import '../styles/LoggedInPage.css';

export default function LoggedInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

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
        setBookedTimeSlots(data.appointments.map(appointment => appointment.time));
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

  // Function to delete an appointment
  const handleDeleteAppointment = async (appointmentId) => {
    if (!user || !user.uid) {
      setError("User data not available");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:3001/appointment/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(user.uid), // Ensure it's an integer
          appointment_id: appointmentId,
        }),
      });

      const data = await response.json();
      console.log("Appointment deletion response:", data);

      if (data.code === "0") {
        console.log("Appointment deleted successfully");
        // Refresh appointments list
        fetchAppointments(user.uid);
        setError(''); // Clear any errors
      } else {
        setError(`Failed to delete appointment: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError("Error deleting appointment");
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
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <VerticalNavBar setActiveTab={setActiveTab} handleLogout={handleLogout} />
                  {activeTab === 'dashboard' && <LandingPage />}
          {activeTab === 'appointments' && (
            <AppointmentsPage
              user={user}
              fetchAppointments={fetchAppointments}
              formatAppointmentTime={formatAppointmentTime}
              handleCreateAppointment={handleCreateAppointment}
              handleDeleteAppointment={handleDeleteAppointment}
              loading={loading}
              error={error}
              appointments={appointments}
              bookedTimeSlots={bookedTimeSlots}
              time={time}
              setTime={setTime}
            />
          )}
          {activeTab === 'files' && <FilesPage />}
              </div>
      <footer>
        <p>© 2025 RRTax Incorporated</p>
      </footer>
    </div>
  );
}