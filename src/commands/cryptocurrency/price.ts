import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType } from 'discord.js';
import { Command, ICommand } from '../../models/Command';

// alternative way of importing node-fetch since it uses ESM3 (not supported in current config)
const _importDynamic = new Function('modulePath', 'return import(modulePath)');
async function fetch(...args: any) {
  const { default: fetch } = await _importDynamic('node-fetch');
  return fetch(...args);
}

const getCrypto = async (crypto: string): Promise<any> => {
  const api = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd  `;
  try {
    const response = await fetch(api, { method: 'GET' });
    if (response.ok) return response.json();
  } catch (err) {
    console.error(err);
  }
};

const formatResult = (result: Promise<any>): string[] => {
  const results: string[] = [];

  Object.entries(result).forEach(([key, value]) => {
    const currentPrice: number = Object.values(value as number)[0];
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    results.push(`${key}: ${formatter.format(currentPrice)}`);
  });

  return results;
};

const price: ICommand = {
  name: 'price',
  description: 'Fetch the current price of a given cryptocurrency.',
  data: new SlashCommandBuilder().addStringOption((option) =>
    option
      .setName('tickers')
      .setDescription('ticker(s) for which price is being fetched for')
      .setRequired(true)
  ),
  execute: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    try {
      const keyword = interaction.options.getString('tickers')!.replace(/%2C/g, ',');
      if (keyword) {
        const result = formatResult(await getCrypto(keyword));
        interaction.reply(result.toString());
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default new Command(price);
