/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import Discord from 'discord.js';
import fs from 'fs';
import { WdbError } from '../util';

export const prefix = '?';

const DISCORD_CLIENT_ID = process.env.NODE_ENV === 'production' ? process.env.DISCORD_CLIENT_ID : process.env.DISCORD_CLIENT_ID_TEST;

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      const simplePath = dirPath.split('commands/');
      if (simplePath[1]) {
        // include subdirectory in path
        arrayOfFiles.push(`${simplePath[1]}/${file}`);
      } else {
        arrayOfFiles.push(`${file}`);
      }
    }
  });
  return arrayOfFiles;
};

const populateDirectoryCommands = (client) => {
  const allFiles = getAllFiles('./src/commands', []);
  // Populate commands from commands directory
  const commandFiles = allFiles.filter((file) => file.endsWith('.js'));
  commandFiles.forEach((file) => {
    const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
  });
};

export default (firebaseKeywords) => {
  const client = new Discord.Client(); // Create Discord bot client
  client.commands = new Discord.Collection();
  client.queue = new Map();
  client.config = { disableEveryone: true, disabledEvents: ['TYPING_START'] };

  populateDirectoryCommands(client);

  client.once('ready', () => {
    console.log('Nom Nom is ready to munch...');
  });

  // Listen for user input
  client.on('message', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    // const voiceChannel = message.member.voice.channel;
    // const permissions = voiceChannel.permissionsFor(message.client.user);

    // Check if the command exists
    if (firebaseKeywords.has(commandName)) return message.channel.send(firebaseKeywords.get(commandName));
    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return message.reply("this command doesn't exist (yet)! \nFor a list of my commands, use `?help`.");

    if (command.guildOnly && message.channel.type === 'dm') {
      return message.reply("I can't execute that command inside DMs!");
    }
    if (command.voiceOnly) {
      if (!message.member.voice.channel) {
        return message.reply('you need to be in a voice channel to use that command!');
      }
    }

    if (command.argsRequired && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}`;
      if (command.usage) reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      return message.channel.send(reply);
    }

    try {
      await command.execute(message, args);
    } catch (error) {
      if (error instanceof WdbError) message.reply(error.reply);
      console.error(error);
    }
  });

  client.login(DISCORD_CLIENT_ID);
};
