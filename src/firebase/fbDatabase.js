export default (admin) => {
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
