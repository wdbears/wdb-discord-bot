import 'dotenv/config';
import { RESTPostAPIApplicationCommandsJSONBody, Routes, REST } from 'discord.js';
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
const disabledCommands: string[] = [];

const populateCommandMaps = () => {
  getAll<Command>('commands', true).forEach((command: Command, fileName: string) => {
    if (command == null) {
      console.log(
        `Something went wrong trying to register the following slash command: ${fileName}`
      );
      return;
    }

    if (!command.isEnabled) {
      disabledCommands.push(command.name);
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
};

const logUnregisteredCommands = () => {
  if (disabledCommands.length == 0) return;
  console.log(
    `The following commands are disabled and will not be registered: ${disabledCommands}`
  );
};

const registerCommands = (
  commandType: string,
  commandJsonBodyArr: RESTPostAPIApplicationCommandsJSONBody[],
  registeredCommands: string[]
) => {
  if (!(registeredCommands.length > 0)) return;

  new REST({ version: '10' })
    .setToken(BOT_TOKEN)
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commandJsonBodyArr })
    .then(() =>
      console.log(
        `Successfully registered the following ${commandType} commands: ${registeredCommands}`
      )
    )
    .catch((err) => console.log(err));
};

populateCommandMaps();
logUnregisteredCommands();
registerCommands('global', globalCommands, registeredGlobalCommands);
registerCommands('guild', guildCommands, registeredGuildCommands);
