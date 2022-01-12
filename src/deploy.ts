import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9';
import { getAll } from './util';
import { Command } from './models/Command';

// Run this file with `yarn deploy` or `yarn deploy-prod` to update slash commands

// Environment Variables
const isProd = process.env['NODE_ENV'] === 'production';
const BOT_TOKEN = isProd ? process.env['BOT_TOKEN']! : process.env['BOT_TOKEN_TEST']!;
const CLIENT_ID = isProd ? process.env['CLIENT_ID']! : process.env['CLIENT_ID_TEST']!;
const GUILD_ID = isProd ? process.env['GUILD_ID']! : process.env['GUILD_ID_TEST']!;

const globalCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const guildCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const registeredCommands: string[] = [];

getAll<Command>('commands', true).forEach((command: Command, fileName: string) => {
  if (command == null) {
    console.log(`Something went wrong trying to register the following slash command: ${fileName}`);
    return;
  }
  const data = command.data.toJSON();
  command.isGlobal ? guildCommands.push(data) : globalCommands.push(data);
  registeredCommands.push(command.name);
});

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

try {
  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: globalCommands })
    .then(() => console.log('Done registering global commands...'));
  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: guildCommands })
    .then(() => console.log('Done registering guild commands...'));
} catch (error) {
  console.log(error);
}
