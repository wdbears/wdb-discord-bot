import * as admin from 'firebase-admin';

export default () => {
  // Connect to Firebase
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
    databaseURL: 'https://wdb-discord-bot.firebaseio.com'
  });

  return admin;
};
