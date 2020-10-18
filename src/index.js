import dotenv from 'dotenv';
import Discord from 'discord.js';
// import ytdl from 'ytdl-core';

dotenv.config(); // Load instance variables

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
