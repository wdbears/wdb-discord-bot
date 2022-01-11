import { CommandInteraction } from 'discord.js';
import { choices } from '../../move-to-database/shared';
import { Command, ICommand } from '../../models/Command';
import { fetch } from '../../util';

export const getFloorPrice = async (collection: string) => {
  try {
    const api = `https://api.opensea.io/api/v1/collection/${collection}/stats?format=json`;
    const res = await fetch(api, { method: 'GET' }).then((res) => res.json());
    return res.stats.floor_price;
  } catch (error) {
    console.log(`Collection ${collection} ran into the following error: ${error}`);
  }
};

const floorall: ICommand = {
  name: 'floorall',
  description: 'Get all floor prices',
  execute: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply();
    const res: string[] = [];
    for (const choice of choices) {
      const floorPrice = await getFloorPrice(choice[1]);
      res.push(`${choice[0]}'s current floor price is: ${await floorPrice.toString()}\n`);
    }
    const resStr = res.sort().toString().replaceAll(',', '');
    await interaction.editReply(resStr);
  }
};

export default new Command(floorall);
