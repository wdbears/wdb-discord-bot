import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType, MessageEmbed } from 'discord.js';
import { Command, ICommand } from '../../models/Command';
import { fetch } from '../../util';

const getPrice = async (crypto: string, useBackup?: boolean): Promise<any> => {
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

const formatPrice = (result: Promise<any>) => {
  const obj = { name: '', price: '' };

  Object.entries(result).forEach(([key, value]) => {
    const currentPrice: number = Object.values(value as number)[0];
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    obj.name = key.toLowerCase();
    obj.price = formatter.format(currentPrice);
  });

  return obj;
};

const getEmbed = (coin: { name: string; price: string }, isBackup?: boolean) => {
  const coinGecko = {
    name: 'CoinGecko',
    url: `https://www.coingecko.com/en/coins/${coin.name}`,
    home: 'https://www.coingecko.com/en'
  };

  const cryptoCompare = {
    name: 'CryptoCompare',
    url: `https://www.cryptocompare.com/coins/${coin.name}/overview/USD`,
    home: 'https://www.cryptocompare.com'
  };

  const api = isBackup ? cryptoCompare : coinGecko;

  return new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(coin.name.toUpperCase())
    .setURL(api.url)
    .setAuthor({ name: api.name, url: api.home })
    .setDescription(coin.price)
    .setTimestamp();
};

export const getCrypto = async (coin: string): Promise<MessageEmbed> => {
  let price = await getPrice(coin);
  if (Object.keys(await price).length === 0) {
    price = await getPrice(coin, true);
    return getEmbed(formatPrice(price), true);
  }
  return getEmbed(formatPrice(price));
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
      const coins: string[] = interaction.options.getString('tickers')!.split(/[ ,]+/);
      const result: MessageEmbed[] = [];

      for (let coin of coins) {
        result.push(await getCrypto(coin));
      }

      if (result.length === 0) {
        await interaction.reply('No result found');
      } else {
        await interaction.reply({ embeds: result });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default new Command(price);
