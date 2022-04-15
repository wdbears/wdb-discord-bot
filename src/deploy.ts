import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9';
import { getAll } from './util';
import { Command } from './models/Command';
import { isProdEnv } from './util';

// Run this file with `yarn deploy` or `yarn deploy-prod` to update slash commands

// Environment Variables
const isProd = isProdEnv();
const BOT_TOKEN = isProd ? process.env['BOT_TOKEN']! : process.env['BOT_TOKEN_TEST']!;
const CLIENT_ID = isProd ? process.env['CLIENT_ID']! : process.env['CLIENT_ID_TEST']!;
const GUILD_ID = isProd ? process.env['GUILD_ID']! : process.env['GUILD_ID_TEST']!;

const globalCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const guildCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const registeredGlobalCommands: string[] = [];
const registeredGuildCommands: string[] = [];

getAll<Command>('commands', true).forEach((command: Command, fileName: string) => {
  if (command == null) {
    console.log(`Something went wrong trying to register the following slash command: ${fileName}`);
    return;
  }
  const data = command.data.toJSON();
  if (command.isGlobal) {
    globalCommands.push(<any>data);
    registeredGlobalCommands.push(command.name);
  } else {
    guildCommands.push(<any>data);
    registeredGuildCommands.push(command.name);
  }
});

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

try {
  if (registeredGlobalCommands.length > 0) {
    rest
      .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: globalCommands })
      .then(() => console.log(`Done registering global commands: ${registeredGlobalCommands}`));
  }

  if (registeredGuildCommands.length > 0) {
    rest
      .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: guildCommands })
      .then(() => console.log(`Done registering guild commands: ${registeredGuildCommands}`));
  }
} catch (error) {
  console.log(error);
}
