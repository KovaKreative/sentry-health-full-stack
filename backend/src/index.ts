import express from 'express';
import cors from 'cors';

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

type Query {
  doctors: [Doctor]
  patients: [Patient]
  patientByName(name: String!): Patient
  appointments: [Appointment]
  appointmentsByPatient(id: ID!): [Appointment]
  appointmentsByDoctor(id: ID!): [Appointment]
  comments(desc: Boolean): [Comment]
}

type Mutation {
  addComment(comment: AddCommentInput!): Comment
  updateComment(id: ID!, body: String!): Comment
  deleteComment(id: ID!, desc: Boolean): [Comment]
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

const resolvers = {
  Query: {
    doctors: () => doctors,
    patients: () => patients,
    patientByName: (_, args: { name: string; }) => patients.find(patient => patient.name === args.name),
    appointments: () => appointments,
    comments: (_, args) => sortComments(comments, args.desc),
    appointmentsByPatient: (_, args: { id: string; }) => appointments.filter(appointment => appointment.patient_id === args.id),
    appointmentsByDoctor: (_, args: { id: string; }) => appointments.filter(appointment => appointment.doctor_id === args.id)
  },

  Doctor: {
    appointments(parent) {
      return appointments.filter(appt => appt.doctor_id === parent.id);
    }
  },

  Patient: {
    appointments(parent) {
      return appointments.filter(appt => appt.patient_id === parent.id);
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
      return appointments.find(appt => parent.appointment_id === appt.id);
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

      const newId = String(Number(comments[comments.length - 1].id) + 1);

      const newComment = {
        id: newId,
        time: new Date(Date.now()).toString(),
        ...args.comment
      };

      comments.push(newComment);

      return newComment;
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
    name: 'Iris N. Jury',
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

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

app.use('/api', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

await new Promise<void>((resolve) => app.listen({ port: 4000 }, resolve));

console.log(`Server listening at http://localhost:4000/`);

app.get('/patients', (req, res) => {

  res.json({ success: true, message: "Hello world!" });
});
