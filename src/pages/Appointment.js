import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './DoctorInterface.css';

const AppointmentRegister = () => {
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      const appointmentList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dateTime: typeof data.dateTime === 'object' ? data.dateTime.toDate() : new Date(data.dateTime), // Handle date format
        };
      });
      setAppointments(appointmentList);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update appointment
        await updateDoc(doc(db, 'appointments', currentId), { doctorId, patientId, dateTime: new Date(dateTime), notes });
        alert('Appointment updated successfully');
      } else {
        // Add new appointment
        await addDoc(collection(db, 'appointments'), { doctorId, patientId, dateTime: new Date(dateTime), notes });
        alert('Appointment successfully created');
      }
      clearForm();
      fetchAppointments(); // Refresh appointments after adding/updating
    } catch (error) {
      console.error("Error saving appointment: ", error);
    }
  };

  const clearForm = () => {
    setDoctorId('');
    setPatientId('');
    setDateTime('');
    setNotes('');
    setIsEditing(false);
    setCurrentId(null);
  };

  const editAppointment = (appointment) => {
    setDoctorId(appointment.doctorId);
    setPatientId(appointment.patientId);
    setDateTime(appointment.dateTime.toISOString().slice(0, 16)); // Format for datetime-local
    setNotes(appointment.notes);
    setIsEditing(true);
    setCurrentId(appointment.id);
  };

  const deleteAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      alert('Appointment deleted successfully!');
      fetchAppointments(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="container">
      <h2>{isEditing ? "Edit Appointment" : "Create an Appointment"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Doctor ID:</label>
          <input
            type="text"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          />
        </div>
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
          <label>Date & Time:</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit" className="button">
          {isEditing ? 'Update Appointment' : 'Create Appointment'}
        </button>
      </form>

      <h2>Existing Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments available.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-record">
            <h3>Doctor ID: {appointment.doctorId}</h3>
            <h3>Patient ID: {appointment.patientId}</h3>
            <h3>Date & Time: {appointment.dateTime instanceof Date ? appointment.dateTime.toString() : new Date(appointment.dateTime).toString()}</h3>
            <h3>Notes: {appointment.notes}</h3>
            <button onClick={() => editAppointment(appointment)}>Edit</button>
            <button onClick={() => deleteAppointment(appointment.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentRegister;

