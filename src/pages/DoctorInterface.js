
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; // Ensure both auth and db are imported
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import {  signOut } from "firebase/auth";
import './DoctorInterface.css';

const DoctorInterface = () => {
  const [doctor, setDoctor] = useState(null);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  // For the appointment form
  const [patientId, setPatientId] = useState('');
  const [appointmentDateTime, setAppointmentDateTime] = useState('');
  const [notes, setNotes] = useState('');

  // For login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoginError(''); // Reset any previous login error

    console.log(`Logging in with Email: ${email} and Password: ${password}`); // Log email and password

    try {
      const result = await addDoc(collection(db, 'doctors'), {email , password});
      console.log(result)
      const user = result.user;
      console.log("User signed in: ", user); // Log user info
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error signing in with email and password: ", error);
      setLoginError(error.message); // Show error message
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsLoggedIn(false);
      setDoctor(null); // Reset doctor information on logout
      setDoctorAppointments([]); // Reset appointments on logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (user) {
        const doctorRef = collection(db, 'doctors');
        const q = query(doctorRef, where('email', '==', user.email)); // Match by email
        const doctorSnapshot = await getDocs(q);

        if (!doctorSnapshot.empty) {
          const doctorData = doctorSnapshot.docs[0].data();
          setDoctor({ id: doctorSnapshot.docs[0].id, ...doctorData });
        }
      }
    };

    const fetchAppointments = async () => {
      if (user) {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('doctorId', '==', user.uid)); // Match by user ID
        const querySnapshot = await getDocs(q);
        const fetchedAppointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctorAppointments(fetchedAppointments);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchDoctorData();
      await fetchAppointments();
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    const newAppointment = {
      doctorId: user.uid, // Use the user's ID
      patientId,
      dateTime: appointmentDateTime,
      notes,
    };

    try {
      // Add the new appointment to the Firestore database
      await addDoc(collection(db, 'appointments'), newAppointment);
      // Update local state to include the new appointment
      setDoctorAppointments(prevAppointments => [...prevAppointments, newAppointment]);
      // Reset form fields
      setPatientId('');
      setAppointmentDateTime('');
      setNotes('');
    } catch (error) {
      console.error("Error adding appointment: ", error);
    }
  };

  return (
    <div className="container">
      <h2>Doctor's Register</h2>
      
      {!isLoggedIn ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loginError && <p className="error">{loginError}</p>} {/* Display login error if any */}
          <button type="submit" className="button">Login</button>
        </form>
      ) : (
        <>
          <button onClick={handleLogout} className="button">Logout</button>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {doctor && (
                <div className="doctor-details">
                  <h3>Doctor's Information</h3>
                  <p><strong>Name:</strong> {doctor.name}</p>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                  <p><strong>Contact Information:</strong> {doctor.contactInfo}</p>
                  <h4>Available Slots</h4>
                  <ul>
                    {doctor.schedule && doctor.schedule.map((slot) => (
                      <li key={slot.slotId}>
                        {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()} ({slot.available ? 'Available' : 'Not Available'})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h3>Add Appointment</h3>
              <form onSubmit={handleAppointmentSubmit}>
                <div>
                  <label>Patient ID:</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Appointment Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={appointmentDateTime}
                    onChange={(e) => setAppointmentDateTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Notes:</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="button">Add Appointment</button>
              </form>

              <h3>Your Appointments</h3>
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorAppointments.length > 0 ? (
                    doctorAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.patientId}</td>
                        <td>{new Date(appointment.dateTime).toLocaleString()}</td>
                        <td>{appointment.notes}</td>
                        <td>
                          <button className="button">Complete</button>
                          <button className="button">Cancel</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No appointments scheduled.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorInterface;
