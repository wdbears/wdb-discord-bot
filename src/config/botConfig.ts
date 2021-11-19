import * as fs from 'fs';
import CustomClient from '../util/CustomClient';
import { removeExtension } from '../util/StringUtil';

export const botConfig = (token: string) => {
  // Create a new client instance
  const client = new CustomClient();

  const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const command = require(`../commands/${removeExtension(file, '.ts')}`);
    client.commands.set(command.data.name, command);
  }

  client.once('ready', () => {
    console.log('Ready!');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });

  client.login(token);
};
