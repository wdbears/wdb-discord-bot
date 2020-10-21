import dotenv from 'dotenv';
import Discord from 'discord.js';
import * as admin from 'firebase-admin';
// import ytdl from 'ytdl-core';

dotenv.config(); // Load instance variables

// Connect to Firebase
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wdb-discord-bot.firebaseio.com',
});

const db = admin.database();

const ref = db.ref();

const commandKeywords = new Map();

ref.on(
  'value',
  (snapshot) => {
    snapshot.forEach((collection) => {
      // const { key } = collection;
      collection.forEach((val) => {
        // console.log(val);
        commandKeywords.set(val.key, val.val());
      });
    });
  },
  (errorObject) => {
    console.log(`The read failed: ${errorObject.code}`);
  }
);

const prefix = '!'; // Prefix for bot trigger command

// Create an instance of a Discord client
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Nom Nom is ready to munch, mmm~');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (commandKeywords.has(command)) {
    return message.channel.send(commandKeywords.get(command));
  }

  if (command === 'args-info') {
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    }
    if (args[0] === 'foo') {
      return message.channel.send('bar');
    }
    message.channel.send(`First argument: ${args[0]}`);
  } else if (command === 'kick') {
    if (!message.mentions.users.size) {
      return message.reply('you need to tag a user in order to kick them!');
    }

    const taggedUser = message.mentions.users.first();
    message.channel.send(`You wanted to kick: ${taggedUser.username}`);
  }
});

client.login(process.env.DISCORD_CLIENT_ID);
