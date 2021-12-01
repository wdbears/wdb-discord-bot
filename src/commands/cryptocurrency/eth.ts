import { CommandInteraction, CacheType } from 'discord.js';
import { ICommand, Command } from '../../models/Command';
import { getCrypto } from './price';

let eth: ICommand = {
  name: 'eth',
  description: 'Fetch the current price of Bitcoin.',
  execute: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    await interaction.reply({ embeds: [await getCrypto('eth')] });
  }
};

export default new Command(eth);
