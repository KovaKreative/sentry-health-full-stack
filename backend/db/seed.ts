const doctors = [
  {
    id: '1',
    name: 'Acula'
  },
  {
    id: '2',
    name: 'Dre'
  }
]

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
    name: 'Iris Coloboma',
  }
]

const appointments = [
  {
    id: '1',
    time: '2024-01-15T17:30:15+05:30',
    doctor: doctors[1],
    patient: patients[0]
  },
  {
    id: '2',
    time: '2024-01-16T17:30:15+05:30',
    doctor: doctors[0],
    patient: patients[1]
  },
  {
    id: '3',
    time: '2024-01-17T17:30:15+05:30',
    doctor: doctors[1],
    patient: patients[2]
  },
]

const comments = [
  {
    id: '1',
    appointment: appointments[0],
    time: '2024-01-18T17:30:15+05:30',
    body: 'The doctor was very nice. I\'m still in pain though.'
  },
  {
    id: '2',
    appointment: appointments[1],
    time: '2024-01-19T17:30:15+05:30',
    body: 'The doctor was helpful, but drew too much blood.'
  },
  {
    id: '3',
    appointment: appointments[2],
    time: '2024-01-20T17:30:15+05:30',
    body: 'The doctor and I didn\'t see eye to eye.'
  },
]