import { ChatInputCommandInteraction } from 'discord.js';
import { ICommand, Command } from '../../models/Command';
import { getCrypto } from './price';

const btc: ICommand = {
  name: 'btc',
  description: 'Fetch the current price of Bitcoin.',
  isEnabled: true,
  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    await interaction.reply({ embeds: [await getCrypto('btc')] });
  }
};

export default new Command(btc);
