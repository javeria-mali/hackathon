
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Adjust the import according to your firebase configuration
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './DoctorInterface.css';

const DoctorRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const auth = getAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, 'doctors'), { email });
      alert('You successfully registered');
      setIsRegistered(true);
    } catch (error) {
      console.error("Error registering: ", error);
      setLoginError(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error logging in: ", error);
      setLoginError(error.message);
    }
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <>
          <h2>{isRegistered ? "Doctor's Login" : "Doctor's Registration"}</h2>
          <form onSubmit={isRegistered ? handleLogin : handleRegister}>
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
            {loginError && <p className="error">{loginError}</p>}
            <button type="submit" className="button">
              {isRegistered ? 'Login' : 'Register'}
            </button>
          </form>
          <p onClick={() => setIsRegistered(!isRegistered)} className="toggle-link">
            {isRegistered ? "Don't have an account? Register" : "Already have an account? Login"}
          </p>
        </>
      ) : (
        <DoctorDashboard onGoBack={() => setIsLoggedIn(false)} /> // Go back functionality
      )}
    </div>
  );
};

const DoctorDashboard = ({ onGoBack }) => {
  const [doctors, setDoctors] = useState([]);

  // Fetch all doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const doctorList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(doctorList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Edit a doctor's details
  const editDoctor = async (id, updatedData) => {
    try {
      const doctorRef = doc(db, 'doctors', id);
      await updateDoc(doctorRef, updatedData);
      alert('Doctor data updated successfully!');
      fetchDoctors(); // Refresh the list after updating
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  // Delete a doctor from Firestore
  const deleteDoctor = async (id) => {
    try {
      await deleteDoc(doc(db, 'doctors', id));
      alert('Doctor deleted successfully!');
      fetchDoctors(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  return (
    <div>
      <h2>Welcome to the Doctor's Dashboard</h2>
      <p>Manage doctor records below.</p>
      <button onClick={onGoBack} className="button">Go Back</button> {/* Go Back button */}
      {doctors.map((doctor) => (
        <div key={doctor.id} className="doctor-record">
          <h3>Email: {doctor.email}</h3>
          <button onClick={() => editDoctor(doctor.id, { email: doctor.email })}>Edit</button>
          <button onClick={() => deleteDoctor(doctor.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default DoctorRegister;
