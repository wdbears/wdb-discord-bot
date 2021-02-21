import Discord from 'discord.js';
import fs from 'fs';
import { WdbError } from '../util';

export const prefix = '?';

const DISCORD_CLIENT_ID = process.env.NODE_ENV === 'production' ? process.env.DISCORD_CLIENT_ID : process.env.DISCORD_CLIENT_ID_TEST;

export default (commandKeywords) => {
  const client = new Discord.Client(); // Create Discord bot client
  client.commands = new Discord.Collection();

  // Populate commands from commands directory
  const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

  commandFiles.forEach((file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
  });

  client.once('ready', () => {
    console.log('Nom Nom is ready to munch...');
  });

  // Listen for user-inputted commands
  client.on('message', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Format command
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if the command exists in the Firebase commands list
    if (commandKeywords.has(commandName)) return message.channel.send(commandKeywords.get(commandName));

    // Check if the command exists in the commands directory
    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return message.reply("this command doesn't exist (yet)! \nFor a list of my commands, use `?help`.");

    // Conditional checks for the command
    if (command.guildOnly && message.channel.type === 'dm') return message.reply("I can't execute that command inside DMs!");

    if (command.argsRequired && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}`;

      if (command.usage) reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;

      return message.channel.send(reply);
    }

    try {
      await command.execute(message, args);
    } catch (error) {
      if (error instanceof WdbError) {
        message.reply(error.reply);
      }
      console.error(error);
    }
  });

  client.login(DISCORD_CLIENT_ID);
};
