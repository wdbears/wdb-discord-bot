async function listFilesByPrefix(storageRef, prefix, delimiter) {
  const options = { prefix };

  if (delimiter) {
    options.delimiter = delimiter;
  }

  const [files] = await storageRef.getFiles(options);

  console.log('Files:');
  files.forEach((file) => {
    console.log(file.name);
  });
}

export default (admin) => {
  const storage = admin.storage();
  const storageRef = storage.bucket('gs://wdb-discord-bot.appspot.com');

  listFilesByPrefix(storageRef, 'pikachu').catch(console.error);
};
