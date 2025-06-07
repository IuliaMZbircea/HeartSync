const mockPatientData = (() => {
  const todayDate = new Date().toISOString().slice(0, 10);
  return {
    name: 'John Smith',
    ecg: 'Normal',
    pulse: 82,
    bodyTemperature: 36.1,
    bloodPressure: {
      systolic: 122,
      diastolic: 78,
    },
    spo2: 98,
    respiratoryRate: 16,
    hrv: 52,
    steps: 7342,
    sleep: {
      duration: 7.2,
      quality: 'Good',
    },
    sex: 'M',
    recommendations: [
      {
        text: 'Reduce your caffeine intake today.',
        date: todayDate,
        new: true,
      },
      {
        text: 'Take a 10-minute walk after lunch.',
        date: todayDate,
        new: true,
      },
      {
        text: 'Monitor your blood pressure daily and record the values.',
        date: '2025-04-03',
        new: false,
      },
      {
        text: 'Maintain a low-sodium, heart-healthy diet.',
        date: '2025-04-02',
        new: false,
      },
      {
        text: 'Engage in at least 30 minutes of moderate exercise most days of the week.',
        date: '2025-04-01',
        new: false,
      },
    ],
    history: {
      pulse: [
        {
          date: todayDate,
          value: 82,
          hourly: [65, 70, 72, 75, 80, 85, 90, 88, 82, 80, 78, 76, 74, 72, 70, 68, 66, 65, 70, 75, 80, 85, 82, 80],
        },
        {
          date: '2025-04-02',
          value: 85,
          hourly: [68, 72, 74, 76, 80, 84, 88, 86, 85, 83, 81, 79, 77, 75, 73, 71, 69, 68, 72, 76, 80, 84, 85, 83],
        },
        {
          date: '2025-04-01',
          value: 103,
          hourly: [80, 85, 90, 95, 100, 105, 110, 108, 103, 100, 98, 96, 94, 92, 90, 88, 86, 85, 90, 95, 100, 105, 103, 100],
        },
      ],
      bodyTemperature: [
        {
          date: todayDate,
          value: 36.1,
          hourly: [36.0, 36.1, 36.2, 36.1, 36.0, 36.1, 36.2, 36.1, 36.0, 36.1, 36.2, 36.1, 36.0, 36.1, 36.2, 36.1, 36.0, 36.1, 36.2, 36.1, 36.0, 36.1, 36.2, 36.1],
        },
        {
          date: '2025-04-02',
          value: 36.2,
          hourly: [36.1, 36.2, 36.3, 36.2, 36.1, 36.2, 36.3, 36.2, 36.1, 36.2, 36.3, 36.2, 36.1, 36.2, 36.3, 36.2, 36.1, 36.2, 36.3, 36.2, 36.1, 36.2, 36.3, 36.2],
        },
      ],
      bloodPressure: [
        {
          date: todayDate,
          systolic: 122,
          diastolic: 78,
          hourly: [
            { systolic: 120, diastolic: 76 }, { systolic: 121, diastolic: 77 }, { systolic: 122, diastolic: 78 },
            { systolic: 123, diastolic: 79 }, { systolic: 124, diastolic: 80 }, { systolic: 122, diastolic: 78 },
          ],
        },
        {
          date: '2025-04-02',
          systolic: 124,
          diastolic: 80,
          hourly: [
            { systolic: 122, diastolic: 78 }, { systolic: 123, diastolic: 79 }, { systolic: 124, diastolic: 80 },
            { systolic: 125, diastolic: 81 }, { systolic: 126, diastolic: 82 }, { systolic: 124, diastolic: 80 },
          ],
        },
      ],
      spo2: [
        {
          date: todayDate,
          value: 98,
          hourly: [98, 98, 97, 97, 98, 99, 98, 98, 97, 97, 98, 99, 98, 98, 97, 97, 98, 99, 98, 98, 97, 97, 98, 99],
        },
        {
          date: '2025-04-02',
          value: 97,
          hourly: [97, 97, 97, 97, 97, 98, 97, 97, 97, 97, 97, 98, 97, 97, 97, 97, 97, 98, 97, 97, 97, 97, 97, 98],
        },
      ],
      respiratoryRate: [
        {
          date: todayDate,
          value: 16,
          hourly: [15, 16, 16, 15, 16, 17, 16, 15, 16, 17, 16, 15, 16, 17, 16, 15, 16, 17, 16, 15, 16, 17, 16, 15],
        },
        {
          date: '2025-04-02',
          value: 15,
          hourly: [15, 15, 15, 15, 15, 16, 15, 15, 15, 15, 15, 16, 15, 15, 15, 15, 15, 16, 15, 15, 15, 15, 15, 16],
        },
      ],
      hrv: [
        {
          date: todayDate,
          value: 52,
          hourly: [50, 51, 52, 53, 54, 52, 51, 50, 52, 53, 54, 52, 51, 50, 52, 53, 54, 52, 51, 50, 52, 53, 54, 52],
        },
        {
          date: '2025-04-02',
          value: 50,
          hourly: [49, 50, 51, 50, 49, 50, 51, 50, 49, 50, 51, 50, 49, 50, 51, 50, 49, 50, 51, 50, 49, 50, 51, 50],
        },
      ],
      steps: [
        {
          date: todayDate,
          value: 7342,
          hourly: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
        },
        {
          date: '2025-04-02',
          value: 8000,
          hourly: [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500],
        },
      ],
      sleep: [
        {
          date: todayDate,
          duration: 7.2,
          quality: 'Good',
          hourly: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        },
        {
          date: '2025-04-02',
          duration: 6.8,
          quality: 'Fair',
          hourly: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        },
      ],
      ecg: [
        {
          date: todayDate,
          value: 'Normal',
          hourly: [0, 1, 0.5, 0, -0.5, 0, 1, 0.5, 0, -0.5, 0, 1, 0.5, 0, -0.5, 0, 1, 0.5, 0, -0.5, 0, 1, 0.5, 0],
        },
        {
          date: '2025-04-02',
          value: 'Normal',
          hourly: [0, 0.8, 0.3, 0, -0.4, 0, 0.9, 0.4, 0, -0.3, 0, 0.8, 0.3, 0, -0.4, 0, 0.9, 0.4, 0, -0.3, 0, 0.8, 0.3, 0],
        },
      ],
    },
    demographics: {
      name: 'John',
      surname: 'Smith',
      cnp: '1800515123456',
      dob: '1980-05-15',
      gender: 'Male',
      patientId: 'P123456789',
      address: '123 Main St, Bucharest, Romania',
      phone: '+40123456789',
      email: 'john.smith@email.com',
    },
    medications: [
      {
        productId: 'M001',
        name: 'Metoprolol',
        status: 'current',
        startDate: '2024-01-10',
        lastPrescription: '2024-04-01',
        dosage: '25mg once daily',
      },
      {
        productId: 'M002',
        name: 'Aspirin',
        status: 'past',
        startDate: '2023-01-10',
        lastPrescription: '2023-12-01',
        dosage: '75mg once daily',
      },
    ],
    allergies: [
      {
        substance: 'Penicillin',
        reaction: 'Rash',
        severity: 'moderate',
      },
      {
        substance: 'Peanuts',
        reaction: 'Anaphylaxis',
        severity: 'severe',
      },
    ],
    healthProblems: [
      {
        problem: 'Hypertension',
        status: 'active',
        since: '2022-06-01',
      },
      {
        problem: 'Arrhythmia',
        status: 'active',
        since: '2023-09-15',
      },
      {
        problem: 'Asthma',
        status: 'resolved',
        since: '2010-01-01',
        resolved: '2015-01-01',
      },
    ],
    versionHistory: [
      {
        item: 'Metoprolol dosage',
        date: '2024-04-01',
        change: 'Increased from 12.5mg to 25mg',
      },
      {
        item: 'Aspirin',
        date: '2023-12-01',
        change: 'Discontinued',
      },
      {
        item: 'Allergy - Peanuts',
        date: '2022-03-10',
        change: 'Added',
      },
    ],
  };
})();

export default mockPatientData;
