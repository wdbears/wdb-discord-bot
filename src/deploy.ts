import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9';
import { getAll } from './util/common';
import { Command } from './models/Command';

// Environment Variables
const BOT_TOKEN = process.env['BOT_TOKEN']!;
const CLIENT_ID = process.env['CLIENT_ID']!;
const GUILD_ID = process.env['GUILD_ID']!;

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

const registerCommands = (
  commandType: string,
  commandJsonBodyArr: RESTPostAPIApplicationCommandsJSONBody[],
  registeredCommands: string[]
) => {
  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commandJsonBodyArr })
    .then(() => console.log(`Done registering ${commandType} commands: ${registeredCommands}`));
};

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);
try {
  if (registeredGlobalCommands.length > 0) {
    registerCommands('global', globalCommands, registeredGlobalCommands);
  }
  if (registeredGuildCommands.length > 0) {
    registerCommands('guild', guildCommands, registeredGuildCommands);
  }
} catch (error) {
  console.log(error);
}
