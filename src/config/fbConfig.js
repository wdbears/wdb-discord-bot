import * as admin from 'firebase-admin';

export default (FIREBASE_CONFIG) => {
  // Connect to Firebase
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(FIREBASE_CONFIG)),
    databaseURL: 'https://wdb-discord-bot.firebaseio.com'
  });

  return admin;
};
