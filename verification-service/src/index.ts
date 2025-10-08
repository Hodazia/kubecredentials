import dotenv from "dotenv";
import express, { Request, Response } from 'express';
import cors from 'cors';
import os from 'os';
import { verificationRouter } from "./router/routes";
import { initDatabase } from './lib/db';

dotenv.config();

const WORKER_ID = process.env.HOST_NAME || os.hostname();
const app = express();
app.use(express.json());
app.use(cors());

initDatabase();

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'verification', worker: WORKER_ID, timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/verify', verificationRouter);


const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`verification service listening on port ${PORT}`);
  console.log("the current directory " , process.cwd());
  console.log(`Worker ID: ${WORKER_ID}`);
});
