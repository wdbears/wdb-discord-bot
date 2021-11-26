import 'dotenv/config';
import express from 'express';

import { initBot } from './config/bot';
// import { fbDatabase, fbStorage } from './firebase';

const isProd = process.env['NODE_ENV'] === 'production';
const BOT_TOKEN = isProd ? process.env['BOT_TOKEN']! : process.env['BOT_TOKEN_TEST']!;

// Setup listener on port 8080 (required for cloud deployment)
const app = express();
const port = process.env['PORT '] || isProd ? 8080 : 8085;

app.get('/', (_req, res) => {
  res.send('Nom Nom is running properly!');
});

app.listen(port, () => {
  console.log(`Nom Nom listening at http://localhost:${port}`);
});

// const fbInstance = fbConfig(); // Establish connection to Firebase
// const commandKeywords = fbDatabase(fbInstance); // Cache bot commands from Firebase
// fbStorage(fbInstance); // Connect to Firebase storage

initBot(BOT_TOKEN);