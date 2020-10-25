import cheerio from 'cheerio';
import fetch from 'node-fetch';
import Discord from 'discord.js';

const fetchFromRunescape = async (itemQuery) => {
  const geDatabase = 'https://secure.runescape.com/m=itemdb_rs/results';
  try {
    const response = await fetch(geDatabase, {
      method: 'POST',
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
        origin: 'https://secure.runescape.com',
        'content-type': 'application/x-www-form-urlencoded',
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'cache-control': 'no-cache',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      body: 'query='.concat(itemQuery).concat('&minPrice=0&maxPrice=&members=')
    });

    if (response.ok) {
      const htmlString = await response.text();

      const $ = cheerio.load(htmlString, {
        normalizeWhitespace: true,
        xmlMode: true
      });

      const results = [];

      const items = $('tbody').find('tr');
      $(items).each(function loopResults(i, item) {
        const itemName = $(item).find('a').attr('title');
        const itemValue = $(item).find('td:nth-child(3)').text();
        const itemLink = $(item).find('td:nth-child(3)').find('a').attr('href');
        results.push({ name: itemName, value: itemValue, link: itemLink });
      });

      return results;
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  name: 'ge',
  description: 'Fetch Grand Exchange price for a given item.',
  args: true,
  usage: '[item name]',
  async execute(message, args) {
    try {
      const keyword = args.toString().replaceAll(',', ' ');
      if (keyword) {
        const items = await fetchFromRunescape(keyword);

        if (!Array.isArray(items) || !items.length) {
          message.channel.send('No items were found for '.concat(keyword));
        }

        if (items.length) {
          const discordEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Grand Exchange Prices')
            .setTimestamp()
            .setFooter('Nom Nom');
          items.forEach((item) => {
            discordEmbed.addField(item.name, item.value);
          });

          message.channel.send(discordEmbed);
        }
      }
    } catch (error) {
      console.error(error);
      message.channel.send(
        'There was an error trying to fetch the Grand Exchange value.'
      );
    }
  }
};
