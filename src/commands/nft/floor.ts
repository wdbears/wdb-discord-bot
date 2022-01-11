import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { choices } from '../../move-to-database/shared';
import { Command, ICommand } from '../../models/Command';
import { fetch } from '../../util';

export const getFloorPrice = async (collection: string) => {
  const api = `https://api.opensea.io/api/v1/collection/${collection}/stats?format=json`;
  const res = await fetch(api, { method: 'GET' }).then((res) => res.json());
  return res.stats.floor_price;
};

const floor: ICommand = {
  name: 'floor',
  description: 'Get floor price',
  data: new SlashCommandBuilder().addStringOption((option) =>
    option
      .setName('collection')
      .setDescription('the nft collection for which the floor is being retrieved')
      .setRequired(true)
      .addChoices(choices)
  ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply();
    const collection: string = interaction.options.getString('collection')!;
    const price = await getFloorPrice(collection);
    await interaction.editReply(`${collection}'s current floor price is: ${price.toString()}`);
  }
};

export default new Command(floor);
