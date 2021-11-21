import { CommandInteraction } from 'discord.js';
import { client } from '../config/botConfig';
import IEvent from '../models/IEvent';

const interactionCreate: IEvent = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction: CommandInteraction): Promise<void> => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      command.execute(interaction);
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
