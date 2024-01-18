import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
const typeDefs = `#graphql

scalar Time

type Doctor {
  id: ID!
  name: String!
}

type Patient {
  id: ID!
  name: String!
}

type Appointment {
  id: ID!
  time: Time!
  doctor: Doctor!
  patient: Patient!
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
  appointments: [Appointment]
  comments: [Comment]
}`;
const doctors = [
    {
        id: '1',
        name: 'Acula'
    },
    {
        id: '2',
        name: 'Dre'
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
        name: 'Iris Coloboma',
    }
];
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
];
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
];
const resolvers = {
    Query: {
        doctors: () => doctors,
        patients: () => patients,
        appointments: () => appointments,
        comments: () => comments
    }
};
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 }
// });
await server.start();
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   next();
// });
app.use('/graphql', cors(), express.json(), expressMiddleware(server));
await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);
// app.listen(4000, () => {
//   console.log(`App is listening on port ${4000}`);
// });
// const port = 8080;
app.get('/patients', (req, res) => {
    res.json({ success: true, message: "Hello world!" });
});
