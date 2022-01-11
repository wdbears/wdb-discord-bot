import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command, ICommand } from '../../models/Command';
import { fetch } from '../../util';

export const getFloorPrice = async (collection: string) => {
  const api = `https://api.opensea.io/api/v1/collection/${collection}/stats?format=json`;
  const res = await fetch(api, { method: 'GET' }).then((res) => res.json());
  return res.stats.floor_price;
};

const choices: [name: string, value: string][] = [];
choices.push(['snails', 'evosnails-nft']);
choices.push(['pixels', 'the-pixels-inc']);
choices.push(['bearx', 'bearxlabs']);
choices.push(['noundles', 'noundles']);
choices.push(['kaiju', 'kaiju-kingz']);
choices.push(['galacticapes', 'galacticapes']);
choices.push(['MAYC', 'mutant-ape-yacht-club']);
choices.push(['cyberkongz', 'cyberkongz']);
choices.push(['pudgypenguins', 'pudgypenguins']);
choices.push(['coolcats', 'cool-cats-nft']);
choices.push(['sherbet', 'playsherbet']);
choices.push(['littles', 'thelittlesnft']);
choices.push(['uncoolcats', 'uncool-cats-nft']);
choices.push(['clonex', 'clonex-mintvial']);
choices.push(['webb', 'worldwidewebbland']);
choices.push(['cryptofoxes', 'cryptofoxes-v2']);
choices.push(['metazoo', 'metazoo-games-tokens']);
choices.push(['syncity', 'syn-city-passes']);
choices.push(['wnd', 'wizards-dragons-game-v2']);
choices.push(['outeridentities', 'neotokyo-outer-identities']);
choices.push(['thingdoms', 'thingdoms-nft-official']);

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
    const collection: string = interaction.options.getString('collection')!;
    const price = await getFloorPrice(collection);
    await interaction.reply(`${collection}'s current floor price is: ${price.toString()}`);
  }
};

export default new Command(floor);
