import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { choices } from '../../move-to-database/floor';
import { Command, ICommand } from '../../models/Command';
import { fetch } from '../../util';

export const getFloorPrice = async (collection: string) => {
  const api = `https://api.opensea.io/api/v1/collection/${collection}/stats?format=json`;
  const res = await fetch(api, { method: 'GET' }).then((res) => res.json());
  return res.stats.floor_price;
};

const floor: ICommand = {
  name: 'floor',
  description: 'Get floor price.',
  data: new SlashCommandBuilder().addStringOption((option) =>
    option
      .setName('collection')
      .setDescription('the nft collection for which the floor is being retrieved')
      .setRequired(true)
      .addChoices(choices)
  ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    const collection: string = interaction.options.getString('collection')!;
    if (collection === 'all') {
      await interaction.deferReply();
      const res: string[] = [];
      for (const choice of choices.sort()) {
        if (choice[0] === 'all') continue;
        const floorPrice = await getFloorPrice(choice[1]);
        res.push(`${await floorPrice.toString()} - **${choice[0]}**\n`);
      }
      const resStr = res.toString().replaceAll(',', '');
      await interaction.editReply(resStr);
    } else {
      const price = await getFloorPrice(collection);
      await interaction.reply(`${price.toString()} - **${collection}**`);
    }
  }
};

export default new Command(floor);
