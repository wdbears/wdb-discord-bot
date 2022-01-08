import { CommandInteraction, CacheType } from 'discord.js';
import { ICommand, Command } from '../../models/Command';
import { getCrypto } from './price';

const eth: ICommand = {
  name: 'eth',
  description: 'Fetch the current price of Ethereum.',
  execute: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    await interaction.reply({ embeds: [await getCrypto('eth')] });
  }
};

export default new Command(eth);
