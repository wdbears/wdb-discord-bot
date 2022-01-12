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
      for (const choice of choices) {
        if (choice[0] === 'all') continue;
        const floorPrice = await getFloorPrice(choice[1]);
        res.push(`${choice[0]}'s current floor price is: ${await floorPrice.toString()}\n`);
      }
      const resStr = res.sort().toString().replaceAll(',', '');
      await interaction.editReply(resStr);
    } else {
      const price = await getFloorPrice(collection);
      await interaction.reply(`**${collection}'s** current floor price is: ${price.toString()}`);
    }
  }
};

export default new Command(floor);
