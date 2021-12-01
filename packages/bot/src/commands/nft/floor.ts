import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';
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
      .addChoice('snails', 'evosnails-nft')
      .addChoice('pixels', 'the-pixels-inc')
      .addChoice('bearx', 'bearxlabs')
      .addChoice('soda', 'sodativity')
      .addChoice('noundles', 'noundles')
      .addChoice('kaiju', 'kaiju-kingz')
      .addChoice('galacticapes', 'galacticapes')
      .addChoice('MAYC', 'mutant-ape-yacht-club')
      .addChoice('cyberkongz', 'cyberkongz')
      .addChoice('pudgypenguins', 'pudgypenguins')
      .addChoice('coolcats', 'cool-cats-nft')
      .addChoice('sherbet', 'playsherbet')
      .addChoice('littles', 'thelittlesnft')
      .addChoice('swampverse', 'swampverseofficial')
      .addChoice('uncoolcats', 'uncool-cats-nft')
  ),
  execute: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    const collection: string = interaction.options.getString('collection')!;
    const price = await getFloorPrice(collection);
    await interaction.reply(`${collection}'s current floor price is: ${price.toString()}`);
  }
};

export default new Command(floor);
