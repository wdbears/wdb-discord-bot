import dotenv from 'dotenv';
import Discord from 'discord.js';
import fs from 'fs';
import fbDatabaseConnect from './config/fbconfig';
import { prefix } from './config/botConfig.json';

dotenv.config(); // Load instance variables

const commandKeywords = fbDatabaseConnect(process.env.FIREBASE_CONFIG); // Cache bot commands from Firebase

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

/** Command validation and handler */
client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commandKeywords.has(commandName))
    return message.channel.send(commandKeywords.get(commandName));

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.guildOnly && message.channel.type === 'dm')
    return message.reply("I can't execute that command inside DMs!");

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}`;

    if (command.usage)
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;

    return message.channel.send(reply);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.DISCORD_CLIENT_ID);
