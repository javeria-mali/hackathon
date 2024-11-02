import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './patientRegister.css';

const PatientRegister = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(true);
  const [patients, setPatients] = useState([]);

  const auth = getAuth();

  // Register new patient
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Register with Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);

      // Add patient data to Firestore
      const patientData = { name, contact, medicalHistory };
      await addDoc(collection(db, 'patients'), patientData);

      setIsLoggedIn(true);
      alert('Registration successful!');
    } catch (error) {
      console.error('Error registering patient:', error);
      alert(error.message);
    }
  };

  // Log in existing patient
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error logging in:', error);
      alert(error.message);
    }
  };

  // Fetch all patients for the dashboard
  const fetchPatients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'patients'));
      const patientsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPatients(patientsList);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // Update patient information
  const updatePatient = async (patientId, updatedData) => {
    try {
      const patientRef = doc(db, 'patients', patientId);
      await updateDoc(patientRef, updatedData);
      alert('Patient data updated successfully!');
      fetchPatients(); // Refresh the list after updating
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  // Delete a patient record
  const deletePatient = async (patientId) => {
    try {
      await deleteDoc(doc(db, 'patients', patientId));
      alert('Patient deleted successfully!');
      fetchPatients(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  // Load patient data on component mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchPatients();
    }
  }, [isLoggedIn]);

  return (
    <div className="registration-container">
      {!isLoggedIn ? (
        isRegistering ? (
          <>
            <h2>Patient Registration</h2>
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Contact Details</label>
                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Medical History</label>
                <textarea value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} required />
              </div>
              <button type="submit" className="register-button">Register</button>
            </form>
            <p onClick={() => setIsRegistering(false)} className="toggle-link">
              Already have an account? Login
            </p>
          </>
        ) : (
          <>
            <h2>Patient Login</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="register-button">Login</button>
            </form>
            <p onClick={() => setIsRegistering(true)} className="toggle-link">
              Don’t have an account? Register
            </p>
          </>
        )
      ) : (
        <PatientDashboard patients={patients} onUpdate={updatePatient} onDelete={deletePatient} setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
};

const PatientDashboard = ({ patients, onUpdate, onDelete, setIsLoggedIn }) => (
  <div>
    <h2>Welcome to the Patient Dashboard</h2>
    <p>Here you can view, update, or delete patient records.</p>
    <button onClick={() => setIsLoggedIn(false)} className="go-back-button">
      Go Back
    </button>
    {patients.map((patient) => (
      <div key={patient.id} className="patient-record">
        <h3>{patient.name}</h3>
        <p>Contact: {patient.contact}</p>
        <p>Medical History: {patient.medicalHistory}</p>
        <button onClick={() => onUpdate(patient.id, { name: patient.name, contact: patient.contact, medicalHistory: patient.medicalHistory })}>
          Edit
        </button>
        <button onClick={() => onDelete(patient.id)}>Delete</button>
      </div>
    ))}
  </div>
);

export default PatientRegister;


