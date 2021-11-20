import 'dotenv/config';
import * as fs from 'fs';
import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9';
import { removeExtension } from './utils/StringUtil';
import { Command } from './models/Command';

// Run this file with `yarn deploy-commands` to update slash commands

// Environment Variables
const isProd = process.env['NODE_ENV'] === 'production';
const BOT_TOKEN = isProd ? process.env['BOT_TOKEN']! : process.env['BOT_TOKEN_TEST']!;
const CLIENT_ID = isProd ? process.env['CLIENT_ID']! : process.env['CLIENT_ID_TEST']!;
const GUILD_ID = isProd ? process.env['GUILD_ID']! : process.env['GUILD_ID_TEST']!;

const globalCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const guildSpecificCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const registeredCommands: string[] = [];

const commandFiles = fs.readdirSync('src/commands').filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
  const command: Command = require(`./commands/${removeExtension(file, '.ts')}`).default;

  command.isGlobal ? guildSpecificCommands.push(command.data.toJSON()) : globalCommands.push(command.data.toJSON());
  registeredCommands.push(command.name);
}

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

try {
  rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: globalCommands });
  rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: guildSpecificCommands });
} catch (error) {
  console.error;
}
