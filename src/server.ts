import 'dotenv/config';
import express from 'express';
import { initBot } from './config/bot';
import { PrismaClient } from '@prisma/client';
// import path from 'path';

export const isProd = process.env['NODE_ENV'] === 'production';
const BOT_TOKEN = isProd ? process.env['BOT_TOKEN']! : process.env['BOT_TOKEN_TEST']!;

export const prisma = new PrismaClient();

// Setup listener on port 8080 (required for cloud deploys)
const app = express();
const port = process.env['PORT '] || isProd ? 8080 : 8085;

app.get('/', (_req, res) => {
  res.send('Nom Nom is running properly!');
  // res.sendFile(path.join(__dirname, '../../site/index.html'));
});

app.listen(port, () => {
  console.log(`Nom Nom listening at http://localhost:${port}`);
  console.log(`Environment:${isProd ? 'PROD' : 'DEV'}`);
});

function handle(signal: any) {
  console.log(`*^!@4=> Received event: ${signal}`);
}
process.on('SIGHUP', handle);

initBot(BOT_TOKEN);
