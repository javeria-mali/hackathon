// src/Data.js

export const doctors = [
    {
      id: 'doctorId_1',
      name: 'Dr. John Doe',
      specialization: 'Cardiologist',
    },
    {
      id: 'doctorId_2',
      name: 'Dr. Jane Smith',
      specialization: 'Dentist',
    },
    // Add more doctors as needed
  ];
  
  export const appointments = [
    {
      id: 'appointmentId_1',
      doctorId: 'doctorId_1',
      patientId: 'patientId_1',
      dateTime: new Date().toString(),
      notes: 'Follow-up appointment',
    },
    // Add more appointments as needed
  ];
  