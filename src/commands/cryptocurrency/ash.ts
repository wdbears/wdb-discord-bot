import { CommandInteraction } from 'discord.js';
import { ICommand, Command } from '../../models/Command';
import { getCrypto } from './price';

const ash: ICommand = {
  name: 'ash',
  description: 'Fetch the current price of ASH.',
  execute: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.reply({ embeds: [await getCrypto('ash')] });
  }
};

export default new Command(ash);
