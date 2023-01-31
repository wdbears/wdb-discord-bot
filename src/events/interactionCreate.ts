import { ChatInputCommandInteraction } from 'discord.js';
import { client } from '../config/bot';
import IEvent from '../models/IEvent';

const interactionCreate: IEvent = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    }
  }
};

export default interactionCreate;
