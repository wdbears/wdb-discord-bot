import * as admin from 'firebase-admin';

export default (FIREBASE_CONFIG) => {
  // Connect to Firebase
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(FIREBASE_CONFIG)),
    databaseURL: 'https://wdb-discord-bot.firebaseio.com',
  });
  const db = admin.database();
  const ref = db.ref();

  // Cache commands from firebase
  const commandKeywords = new Map();
  ref.on(
    'value',
    (snapshot) => {
      snapshot.forEach((collection) => {
        collection.forEach((val) => {
          commandKeywords.set(val.key, val.val());
        });
      });
    },
    (errorObject) => {
      console.error(`The read failed: ${errorObject.code}`);
    }
  );

  return commandKeywords;
};
