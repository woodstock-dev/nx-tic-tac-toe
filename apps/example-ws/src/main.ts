/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from 'express';
import * as path from 'path';

import { v1Router } from './no-chain';


const app = express();
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/api/v1', v1Router);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
