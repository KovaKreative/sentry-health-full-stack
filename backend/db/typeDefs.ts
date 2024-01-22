export default `#graphql

scalar Time

type Doctor {
  id: ID!
  name: String!
  appointments: [Appointment]
}

type Patient {
  id: ID!
  name: String!
  appointments: [Appointment]
  files: [PatientFile]
}

type Appointment {
  id: ID!
  time: Time!
  doctor: Doctor!
  patient: Patient!
  comments(desc: Boolean): [Comment]!
}

type Comment {
  id: ID!
  appointment: Appointment!
  time: Time
  body: String!
}

type PatientFile {
  id: ID!
  filename: String!
  patient: Patient!
}

type Query {
  doctors: [Doctor]
  patients: [Patient]
  patientByName(name: String!): Patient
  appointments: [Appointment]
  appointmentsByPatient(id: ID!): [Appointment]
  appointmentsByDoctor(id: ID!): [Appointment]
  comments(desc: Boolean): [Comment]
  patientFiles: [PatientFile]
  patientFilesByPatient(id: ID!): [PatientFile]
  patientFileById(id: ID!): PatientFile!
}

type Mutation {
  addComment(comment: AddCommentInput!): Comment
  updateComment(id: ID!, body: String!): Comment
  deleteComment(id: ID!, desc: Boolean): [Comment]
  addPatientFile(patient_id: String, filename: String): [PatientFile]
}

input AddCommentInput {
  appointment_id: String!,
  body: String!
}
`;