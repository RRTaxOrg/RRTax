import { useState, useEffect } from 'react';

export default function AppointmentsPage({ user, fetchAppointments, formatAppointmentTime, handleCreateAppointment, handleDeleteAppointment, loading, error, appointments, bookedTimeSlots, time, setTime }) {
  const isTimeSlotBooked = (timeSlot) => {
    const unixTimeSlot = Math.floor(new Date(timeSlot).getTime() / 1000);
    return bookedTimeSlots.includes(unixTimeSlot);
  };

  return (
    <div className="main-content flex flex-col min-h-screen bg-gray-50 mt-20 mb-20">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
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
              onClick={handleCreateAppointment}
              className="w-full px-4 py-2 text-white bg-customBlue rounded-md disabled:bg-gray-300"
              disabled={loading || !user || !time || isTimeSlotBooked(time)}
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr key={appointment.appointment_id || index}>
                      <td>{formatAppointmentTime(appointment.time)}</td>
                      <td>{appointment.appointment_id}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteAppointment(appointment.appointment_id)}
                          className="px-4 py-2 text-white bg-red-500 rounded-md"
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
            <p className="text-gray-500 text-center">No appointments scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}