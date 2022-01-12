import 'dotenv/config';
import express from 'express';
import { initBot } from './config/bot';
// import path from 'path';

const isProd = process.env['NODE_ENV'] === 'production';
const BOT_TOKEN = isProd ? process.env['BOT_TOKEN']! : process.env['BOT_TOKEN_TEST']!;

// Setup listener on port 8080 (required for cloud deploys)
const app = express();
const port = process.env['PORT '] || isProd ? 8080 : 8085;

app.get('/', (_req, res) => {
  res.send('Nom Nom is running properly!');
  // res.sendFile(path.join(__dirname, '../../site/index.html'));
});

app.listen(port, () => {
  console.log(`Nom Nom listening at http://localhost:${port}`);
});

initBot(BOT_TOKEN);
