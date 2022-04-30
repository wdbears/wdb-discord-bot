import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Command, ICommand } from '../../models/Command';
import { collections, sortedCollections, collectionsMap } from '../../move-to-database/floor';
import { fetch } from '../../util';

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
            .addChoices(...collections.filter((c) => !c.isBlueChip))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('bluechips')
        .setDescription('List of all blue chip collections')
        .addStringOption((option) =>
          option
            .setName('collection')
            .setDescription('The NFT collection for which the floor is being retrieved')
            .setRequired(true)
            .addChoices(...collections.filter((c) => c.isBlueChip))
        )
    ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    const subcommand = interaction.options.getSubcommand();

    const startTime = Date.now();
    const resultEmbed = createEmbed();

    if (subcommand == 'all') {
      const startTime = Date.now();
      await interaction.deferReply();
      const prices = await getAllFloorPrices();
      updateEmbed(prices, resultEmbed, startTime);
      interaction.editReply({ embeds: [resultEmbed] });
      return;
    }

    if (subcommand == 'collections' || subcommand == 'bluechips') {
      const collection: string = interaction.options.getString('collection')!;
      const collectionToPrice = await getFloorPrice(collection);

      if (collectionToPrice == null) {
        await interaction.reply(`Error retrieving ${collection}!`);
        return;
      }

      updateEmbed([collectionToPrice], resultEmbed, startTime);

      const imageURL = await getImageUrl(collection);
      if (imageURL != null) {
        resultEmbed.setThumbnail(await imageURL);
      }

      interaction.reply({ embeds: [resultEmbed] });
    }
  }
};

const getCollection = async (collection: string) => {
  const endpoint = `https://api.opensea.io/api/v1/collection/${collection}?format=json`;

  const res = await fetch(endpoint, { method: 'GET' })
    .then((res) => res.json())
    .catch(() => console.log(`${collection} is not a valid OpenSea collection.`));

  return res.collection;
};

const getFloorPrice = async (osCollection: string) => {
  const collection = await getCollection(osCollection);
  if (collection == undefined) return null;
  const simpleName = collectionsMap.get(osCollection);
  return { name: simpleName, price: collection.stats.floor_price };
};

const getImageUrl = async (osCollection: string) => {
  const collection = await getCollection(osCollection);
  return collection == undefined ? null : collection.image_url;
};

async function getAllFloorPrices(): Promise<any[]> {
  const promises = sortedCollections.map(({ value }) => getFloorPrice(value));
  return await Promise.all(promises);
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

const updateEmbed = (collectionToFloorMap: any[], embed: MessageEmbed, startTime: number) => {
  let res = '';
  collectionToFloorMap.forEach((entry) => {
    try {
      res += `**${entry['name']}** - ${entry['price']}\n`;
      // embed.addField(entry['name'], entry['price'].toString(), false);
    } catch (error) {
      console.log('Issue with ' + entry);
    }
  });
  embed.setDescription(res);
  embed.setFooter({ text: `Lookup took ${Date.now() - startTime}ms` }); // Add performance stats
};

export default new Command(floor);
