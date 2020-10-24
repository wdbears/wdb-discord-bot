import dotenv from 'dotenv';
import Discord from 'discord.js';
import fs from 'fs';
import fbDatabaseConnect from './config/fbconfig';

dotenv.config(); // Load instance variables

const commandKeywords = fbDatabaseConnect(process.env.FIREBASE_CONFIG); // Cache bot commands from Firebase

const prefix = '?'; // Prefix for bot trigger command

// Create an instance of a Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

client.once('ready', () => {
  console.log('Nom Nom is ready to munch...');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (commandKeywords.has(command)) {
    return message.channel.send(commandKeywords.get(command));
  }

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.DISCORD_CLIENT_ID);