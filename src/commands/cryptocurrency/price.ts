import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType } from 'discord.js';
import { Command, ICommand } from '../../models/Command';
import { fetch } from '../../util';

const getCrypto = async (crypto: string, useBackup?: boolean): Promise<any> => {
  const api = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`;
  const backup = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${crypto}&tsyms=USD`;
  try {
    const res = useBackup
      ? await fetch(backup, { method: 'GET' })
      : await fetch(api, { method: 'GET' });
    if (res.ok) return res.json();
  } catch (error) {
    console.error;
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
        let result = await getCrypto(keyword);
        if (Object.keys(result).length === 0) result = await getCrypto(keyword, true);
        result = formatResult(result);
        interaction.reply(result.toString());
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default new Command(price);
