import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Command, ICommand } from '../../models/Command';
import { choices } from '../../move-to-database/floor';
import { fetch } from '../../util';

const api = 'https://api.opensea.io/api/v1/collection/';

export const getFloorPrice = async (collection: string) => {
  const stats = api + `${collection}/stats?format=json`;

  const res = await fetch(stats, { method: 'GET' })
    .then((res) => res.json())
    .catch(() => console.log(`${collection} is not a valid OpenSea collection.`));

  return res.stats == undefined ? null : res.stats.floor_price;
};

export const getImageUrl = async (collection: string) => {
  const imageUrlEndpoint = api + `${collection}?format=json`;

  const res = await fetch(imageUrlEndpoint, { method: 'GET' })
    .then((res) => res.json())
    .catch(() => console.log(`${collection} is not a valid OpenSea collection.`));

  return res.collection == undefined ? null : res.collection.image_url;
};

async function getAllFloorPrices() {
  const res: Map<string, string> = new Map();
  const validChoices = choices.sort().filter((c) => c[0] != 'all');

  for (const choice of validChoices) {
    const floorPrice = await getFloorPrice(choice[1]);
    if (floorPrice == null) {
      res.set(choice[0], 'Error retrieving price');
    } else {
      res.set(choice[0], await floorPrice.toString());
    }
  }

  return res;
}

const createEmbed = () => {
  return new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Floor Prices')
    .setURL('https://opensea.io')
    .setDescription('Current floor prices for tracked OpenSea collections')
    .setThumbnail('https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png')
    .setTimestamp();
};

const updateEmbed = async (collectionToFloorMap: Map<string, string>, embed: MessageEmbed) => {
  collectionToFloorMap.forEach((collection, price) => {
    embed.addField(price, collection, true);
  });
};

const floor: ICommand = {
  name: 'floor',
  description: 'Get floor price.',
  data: new SlashCommandBuilder()
    .addSubcommand((subcommand) => subcommand.setName('all').setDescription('Get all floor prices'))
    .addSubcommand((subcommand) =>
      subcommand
        .setName('collections')
        .setDescription('List of all supported collections')
        .addStringOption((option) =>
          option
            .setName('collection')
            .setDescription('The NFT collection for which the floor is being retrieved')
            .setRequired(true)
            .addChoices(choices)
        )
    ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    const subcommand = interaction.options.getSubcommand();

    const resultEmbed = createEmbed();

    if (subcommand == 'all') {
      await interaction.deferReply();
      const prices = await getAllFloorPrices();
      await updateEmbed(prices, resultEmbed);
      await interaction.editReply({ embeds: [resultEmbed] });
    }

    if (subcommand == 'collections') {
      const collection: string = interaction.options.getString('collection')!;
      const price = await getFloorPrice(collection);

      if (price == null) {
        await interaction.reply(`Error retrieving ${collection}!`);
        return;
      }

      const map = new Map();
      map.set(collection, price.toString());
      updateEmbed(map, resultEmbed);

      const imageURL = await getImageUrl(collection);
      if (imageURL != null) {
        resultEmbed.setThumbnail(await imageURL);
      }

      await interaction.reply({ embeds: [resultEmbed] });
    }
  }
};

export default new Command(floor);
