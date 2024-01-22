import express from 'express';
import fs from 'node:fs';
import cors from 'cors';
import multer from 'multer';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

const typeDefs = `#graphql

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

const sortComments = function(comments, desc) {
  const sortedComments = comments.toSorted((a, b) => {
    if (!desc) {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    }
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
  return sortedComments;
};

const generateId = function() {
  return `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
};

const resolvers = {
  Query: {
    doctors: () => doctors,
    patients: () => patients,
    patientByName: (_, args: { name: string; }) => patients.find(p => p.name === args.name),
    appointments: () => appointments,
    comments: (_, args) => sortComments(comments, args.desc),
    appointmentsByPatient: (_, args: { id: string; }) => appointments.filter(a => a.patient_id === args.id),
    appointmentsByDoctor: (_, args: { id: string; }) => appointments.filter(a => a.doctor_id === args.id),
    patientFiles: () => patientFiles,
    patientFilesByPatient: (_, args: { id: string; }) => patientFiles.filter(f => f.patient_id === args.id),
    patientFileById: (_, args: { id: string; }) => patientFiles.find(f => f.id === args.id)
  },

  Doctor: {
    appointments(parent) {
      return appointments.filter(a => a.doctor_id === parent.id);
    }
  },

  Patient: {
    appointments(parent) {
      return appointments.filter(a => a.patient_id === parent.id);
    },
    files(parent) {
      return patientFiles.filter(f => f.patient_id === parent.id);
    }
  },

  Appointment: {
    patient(parent) {
      return patients.find(p => p.id === parent.patient_id);
    },
    doctor(parent) {
      return doctors.find(d => d.id === parent.doctor_id);
    },
    comments(parent, args) {
      const filteredComments = comments.filter(c => c.appointment_id === parent.id);
      return sortComments(filteredComments, args.desc);
    }
  },

  Comment: {
    appointment(parent) {
      return appointments.find(a => parent.appointment_id === a.id);
    }
  },

  PatientFile: {
    patient(parent) {
      return patients.find(p => parent.patient_id === p.id);
    }
  },

  Mutation: {
    deleteComment(_, args) {
      const index = comments.findIndex(c => c.id === args.id);
      let deletedComment = null;

      if (index >= 0) {
        deletedComment = comments.splice(index, 1)[0];
      }

      const filteredComments = comments.filter(c => c.appointment_id === deletedComment.appointment_id);
      return sortComments(filteredComments, args.desc);
    },
    updateComment(_, args) {
      const index = comments.findIndex(c => c.id === args.id);

      if (index >= 0) {
        const comment = comments[index];
        comment.body = args.body;
        comment.time = new Date(Date.now()).toString();
      }

      return comments[index];
    },
    addComment(_, args) {

      const newId = generateId();

      const newComment = {
        id: newId,
        time: new Date(Date.now()).toString(),
        ...args.comment
      };

      comments.push(newComment);

      return newComment;
    },
    addPatientFile(_, args) {
      const newId = generateId();
      patientFiles.push({ id: newId, filename: args.filename, patient_id: args.patient_id });
    }
  }
};

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

const patientFiles = [

];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'downloads/');
  },
  filename: (req, file, cb) => {
    const suffix = generateId();
    cb(null, `${file.fieldname}-${suffix}.json`);
  },
});

const upload = multer({ storage });
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
const PORT = 4000;

await server.start();

app.use('/api', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

await new Promise<void>((resolve) => app.listen({ port: PORT }, resolve));

console.log(`Server listening on Port ${PORT}`);

app.get('/patients', (req, res) => {
  res.json({ success: true, message: "Hello world!" });
});

app.post('/upload', cors(), upload.single('patientFile'), (req, res) => {

  console.log(req.body);
  const patient_id = req.body.patientId;

  const { mimetype, originalname, filename, destination } = req.file;

  resolvers.Mutation.addPatientFile(null, { patient_id, filename });

  return res.json({ success: true, patientFiles: [...patientFiles.filter(f => f.patient_id === patient_id)] });

});

app.get('/download/:id', cors(), (req, res) => {
  const { id } = req.params;
  console.log(patientFiles);
  const { filename } = patientFiles.find(f => f.id === id);

  res.sendFile(`${filename}`, { root: 'downloads' });
});