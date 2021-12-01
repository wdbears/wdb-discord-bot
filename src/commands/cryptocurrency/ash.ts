import { CommandInteraction, CacheType } from 'discord.js';
import { ICommand, Command } from '../../models/Command';
import { getCrypto } from './price';

let ash: ICommand = {
  name: 'ash',
  description: 'Fetch the current price of ASH.',
  execute: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    await interaction.reply({ embeds: [await getCrypto('ash')] });
  }
};

export default new Command(ash);
