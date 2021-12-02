import { CacheType, CommandInteraction } from 'discord.js';
import { Command, ICommand } from '../../models/Command';
import { fetch } from '../../util';

export const getSales = async () => {
  const api = `https://api.niftygateway.com/redemption-project/?name=mass`;
  const res = await fetch(api, { method: 'GET' }).then((res) => res.json());
  return await res.message.totalQuantityPurchased;
};

const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  return formatter.format(price);
};

const floor: ICommand = {
  name: 'pak',
  description: 'Get Paks net worth',
  execute: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    const price = (await getSales()) * 300;
    await interaction.reply(`Pak has made at least ${formatPrice(price)} from his Merge project.`);
  }
};

export default new Command(floor);
