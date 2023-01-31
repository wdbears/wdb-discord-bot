import { ChatInputCommandInteraction } from 'discord.js';
import { ICommand, Command } from '../../models/Command';
import { getCrypto } from './price';

const ash: ICommand = {
  name: 'ash',
  description: 'Fetch the current price of ASH.',
  isEnabled: true,
  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    await interaction.reply({ embeds: [await getCrypto('ash')] });
  }
};

export default new Command(ash);
