import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9';
import { getCommands } from './util';

// Run this file with `yarn deploy` or `yarn deploy-prod` to update slash commands

// Environment Variables
const isProd = process.env['NODE_ENV'] === 'production';
const BOT_TOKEN = isProd ? process.env['BOT_TOKEN']! : process.env['BOT_TOKEN_TEST']!;
const CLIENT_ID = isProd ? process.env['CLIENT_ID']! : process.env['CLIENT_ID_TEST']!;
const GUILD_ID = isProd ? process.env['GUILD_ID']! : process.env['GUILD_ID_TEST']!;

const globalCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const guildCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const registeredCommands: string[] = [];

// const commandFiles = getFilesFromDirectory('src/commands', '.ts');

// for (const file of commandFiles) {
//   const command: Command = getDefaultExport('./commands', file);
//   const data = command.data.toJSON();
//   command.isGlobal ? guildCommands.push(data) : globalCommands.push(data);
//   registeredCommands.push(command.name);
// }

getCommands().forEach((command) => {
  console.log(command);
  const data = command.data.toJSON();
  command.isGlobal ? guildCommands.push(data) : globalCommands.push(data);
  registeredCommands.push(command.name);
});

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

try {
  rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: globalCommands });
  rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: guildCommands });
} catch (error) {
  console.error;
}
