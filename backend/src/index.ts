import express from 'express';
import cors from 'cors';
import multer from 'multer';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { generateId } from './functions.js';

import typeDefs from '../db/typeDefs.js';

import { doctors, patients, appointments, comments, patientFiles } from '../db/seeds.js';
import createResolvers from '../db/resolvers.js';

const resolvers = createResolvers(doctors, patients, appointments, comments, patientFiles);

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

app.get('/download/:id', cors(), (req, res) => {
  const { id } = req.params;
  const { filename } = patientFiles.find(f => f.id === id);

  res.sendFile(`${filename}`, { root: 'downloads' });
});

app.post('/upload', cors(), upload.single('patientFile'), (req, res) => {

  console.log(req.body);
  const patient_id = req.body.patientId;

  const { mimetype, originalname, filename, destination } = req.file;

  resolvers.Mutation.addPatientFile(null, { patient_id, filename });

  return res.json({ success: true, patientFiles: [...patientFiles.filter(f => f.patient_id === patient_id)] });

});

