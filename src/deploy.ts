import 'dotenv/config';
import * as fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { removeExtension } from './util/StringUtil';

// Run this file with `yarn deploy-commands` to update slash commands

// Environment Variables
const isProd = process.env['NODE_ENV'] === 'production';
const BOT_TOKEN = isProd ? process.env['BOT_TOKEN']! : process.env['BOT_TOKEN_TEST']!;
const CLIENT_ID = isProd ? process.env['CLIENT_ID']! : process.env['CLIENT_ID_TEST']!;
const GUILD_ID = isProd ? process.env['GUILD_ID']! : process.env['GUILD_ID_TEST']!;

const commands: any = [];
const commandFiles = fs.readdirSync('src/commands').filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
  const command = require(`./commands/${removeExtension(file, '.ts')}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
