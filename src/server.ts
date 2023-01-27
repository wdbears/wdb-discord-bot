import 'dotenv/config';
import express from 'express';
import { initBot } from './config/bot';
import { PrismaClient } from '@prisma/client';
import { getEnvironmentType } from './util/environmentType';

export const prisma = new PrismaClient();
const envType = getEnvironmentType();

// Setup listener on port 8080 (required for cloud deploys)
const app = express();
const port = process.env['PORT'];

app.get('/', (_req, res) => {
  res.send('Nom Nom is running properly!');
});

app.listen(port, () => {
  console.log(`Nom Nom listening at http://localhost:${port}`);
  console.log(`Environment:${envType.desc}`);
});

function handle(signal: any) {
  console.log(`*^!@4=> Received event: ${signal}`);
}
process.on('SIGHUP', handle);

initBot(process.env['BOT_TOKEN']!);
