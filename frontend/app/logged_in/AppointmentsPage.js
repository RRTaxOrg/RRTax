import { useState, useEffect, useRef } from 'react';

export default function AppointmentsPage({ user, fetchAppointments, formatAppointmentTime, handleCreateAppointment, handleDeleteAppointment, loading, error, appointments, bookedTimeSlots, time, setTime }) {
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [newAppointmentTime, setNewAppointmentTime] = useState('');
  const [rescheduleMessage, setRescheduleMessage] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const createButtonRef = useRef(null);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Separate and sort appointments
  const sortedAndFilteredAppointments = () => {
    if (!appointments) return { upcoming: [], past: [] };
    
    const now = currentDateTime.getTime() / 1000;
    const upcoming = [];
    const past = [];
    
    appointments.forEach(appointment => {
      if (appointment.time > now) {
        upcoming.push(appointment);
      } else {
        past.push(appointment);
      }
    });
    
    // Sort upcoming appointments by time (ascending)
    upcoming.sort((a, b) => a.time - b.time);
    // Sort past appointments by time (descending)
    past.sort((a, b) => b.time - a.time);
    
    return { upcoming, past };
  };
  
  const { upcoming, past } = sortedAndFilteredAppointments();

  const isTimeSlotBooked = (timeSlot) => {
    const unixTimeSlot = Math.floor(new Date(timeSlot).getTime() / 1000);
    return bookedTimeSlots.includes(unixTimeSlot);
  };

  const handleRescheduleClick = (appointment) => {
    setRescheduleMode(true);
    setRescheduleAppointment(appointment);
    setNewAppointmentTime('');
    setRescheduleMessage('');
  };

  const handleRescheduleConfirm = async () => {
    if (!newAppointmentTime || isTimeSlotBooked(newAppointmentTime)) {
      setRescheduleMessage('Please select a valid, available time.');
      return;
    }

    try {
      // First delete the old appointment
      await handleDeleteAppointment(rescheduleAppointment.appointment_id);
      
      // Set the time in the main form to our new time
      setTime(newAppointmentTime);
      
      // Exit reschedule mode before creating new appointment
      setRescheduleMode(false);
      setRescheduleAppointment(null);
      
      // Small delay to ensure the state is updated and UI is refreshed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trigger the click on the create appointment button
      if (createButtonRef.current) {
        createButtonRef.current.click();
      } else {
        // Fallback if ref isn't available
        await handleCreateAppointment();
      }
      
      // Show success message
      setRescheduleMessage('Appointment successfully rescheduled!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setRescheduleMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error during rescheduling:", error);
      setRescheduleMessage('Error rescheduling appointment. Please try again.');
    }
  };

  const handleRescheduleCancel = () => {
    setRescheduleMode(false);
    setRescheduleAppointment(null);
    setNewAppointmentTime('');
  };

  return (
    <div className="main-content flex flex-col min-h-screen bg-gray-50 mt-20 mb-20">
      {rescheduleMessage && (
        <div className="fixed top-20 left-0 right-0 mx-auto w-full max-w-md bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center z-50">
          {rescheduleMessage}
        </div>
      )}

      {rescheduleMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-customBlue mb-4">Reschedule Appointment</h2>
            <p className="mb-4">Current appointment time: {formatAppointmentTime(rescheduleAppointment.time)}</p>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select New Time:</label>
              <input
                type="datetime-local"
                value={newAppointmentTime}
                onChange={(e) => setNewAppointmentTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                min={new Date().toISOString().slice(0, 16)}
              />
              {isTimeSlotBooked(newAppointmentTime) && (
                <p className="text-red-500 text-sm mt-1">This time slot is already booked</p>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleRescheduleConfirm}
                className="flex-1 px-4 py-2 text-white bg-customBlue rounded-md disabled:bg-gray-300"
                disabled={!newAppointmentTime || isTimeSlotBooked(newAppointmentTime) || loading}
              >
                Confirm Reschedule
              </button>
              <button
                onClick={handleRescheduleCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-customBlue mb-4">Your Appointments</h1>
        
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
              min={new Date().toISOString().slice(0, 16)} // Disable past dates
            />
            <button
              ref={createButtonRef}
              onClick={handleCreateAppointment}
              className="w-full px-4 py-2 text-white bg-customBlue rounded-md disabled:bg-gray-300"
              disabled={loading || !user || !time || isTimeSlotBooked(time)}
            >
              {loading ? 'Processing...' : 'Create Appointment'}
            </button>
          </div>
        </div>
        
        {/* Upcoming Appointments Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-customBlue mb-2">Upcoming Appointments</h2>
          {loading ? (
            <p className="text-gray-500 text-center">Loading appointments...</p>
          ) : upcoming && upcoming.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Appointment ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((appointment, index) => (
                    <tr key={appointment.appointment_id || index}>
                      <td>{formatAppointmentTime(appointment.time)}</td>
                      <td>{appointment.appointment_id}</td>
                      <td className="flex space-x-1">
                        <button
                          onClick={() => handleRescheduleClick(appointment)}
                          className="px-3 py-1 text-white bg-yellow-500 rounded-md mr-1"
                          disabled={loading}
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleDeleteAppointment(appointment.appointment_id)}
                          className="px-3 py-1 text-white bg-red-500 rounded-md"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No upcoming appointments scheduled</p>
          )}
        </div>
        
        {/* Past Appointments Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Past Appointments</h2>
          {loading ? (
            <p className="text-gray-500 text-center">Loading appointments...</p>
          ) : past && past.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Appointment ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {past.map((appointment, index) => (
                    <tr key={appointment.appointment_id || index} className="text-gray-500">
                      <td>{formatAppointmentTime(appointment.time)}</td>
                      <td>{appointment.appointment_id}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteAppointment(appointment.appointment_id)}
                          className="px-3 py-1 text-white bg-red-500 rounded-md"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No past appointments</p>
          )}
        </div>
      </div>
    </div>
  );
}