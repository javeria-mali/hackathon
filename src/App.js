import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DoctorInterface from './pages/DoctorInterface';
import PatientInterface from './pages/PatientInterface';
import './styles/App.css';
import DoctorRegister from './pages/doctorRegister';
import PatientRegister from './pages/patientRegister';
import Appointment from './pages/Appointment';




function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/doctor" element={<DoctorRegister />} />
            <Route path="/patient" element={<PatientRegister />} />
            <Route path="/Appointment" element={<Appointment />} />
            <Route path="/" element={<h2>Welcome to the Doctor's Appointment System</h2>} />
           
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
