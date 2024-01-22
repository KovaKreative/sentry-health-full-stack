const doctors = [
    {
        id: '1',
        name: 'Acula',
    },
    {
        id: '2',
        name: 'Dre',
    }
];
const patients = [
    {
        id: '1',
        name: 'Aiman Payne',
    },
    {
        id: '2',
        name: 'Paul Monary',
    },
    {
        id: '3',
        name: 'Iris N Jury',
    }
];
const appointments = [
    {
        id: '1',
        time: '2024-01-15T17:30:15+05:30',
        doctor_id: "2",
        patient_id: "1",
    },
    {
        id: '2',
        time: '2024-01-16T17:30:15+05:30',
        doctor_id: "1",
        patient_id: "2",
    },
    {
        id: '3',
        time: '2024-01-17T17:30:15+05:30',
        doctor_id: "2",
        patient_id: "3",
    },
];
const comments = [
    {
        id: '1',
        appointment_id: "1",
        time: '2024-01-18T17:30:15+05:30',
        body: 'Doctor prescribed medicinal cannabis to alleviate chronic pain.'
    },
    {
        id: '2',
        appointment_id: "1",
        time: '2024-01-20T17:30:15+05:30',
        body: 'Patient reported pain relief.'
    },
    {
        id: '3',
        appointment_id: "2",
        time: '2024-01-19T17:30:15+05:30',
        body: 'Doctor drew 20oz of blood for testing.'
    },
    {
        id: '4',
        appointment_id: "3",
        time: '2024-01-20T17:30:20+05:30',
        body: 'The doctor and the patient didn\'t see eye to eye.'
    },
];
const patientFiles = [];
export { doctors, patients, appointments, comments, patientFiles };
