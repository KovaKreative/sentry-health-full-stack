import express from 'express';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});