// import 'dotenv/config';
import { Message } from 'discord.js';
import IEvent from '../models/IEvent';
import { getEmoji } from '../util/bot';

const messageCreate: IEvent = {
  name: 'messageCreate',
  once: false,
  execute: async (message: Message) => {
    const channel = message.channel;
    const guild = message.guild;
    const msgAuthor = message.author;
    const msgAuthorDisplayName = message.member?.displayName;
    const msgContent = message.content.toLowerCase();

    if (msgAuthor.bot) return;
    // TODO add permissions check for users

    switch (msgContent) {
      case '!guard': {
        await message.delete();
        await channel.send('GUARD THE TOWER!');
        break;
      }
      case 'afroact': {
        await message.delete();
        const messages = await channel.messages.fetch({ limit: 1 });

        const lastMessage = await messages.first();
        if (!lastMessage || lastMessage.author.bot) return;

        const reaction = getEmoji(guild, 'afro');
        if (reaction != null) await lastMessage.react(reaction);
        break;
      }
      case 'afro': {
        await message.delete();
        const afroEmoji = getEmoji(guild, 'afro');
        await channel.send(`${msgAuthorDisplayName} ${afroEmoji}'s you.`);
        break;
      }
      case 'police': {
        await message.delete();
        const alertEmoji = getEmoji(guild, 'alert');
        const kissEmoji = getEmoji(guild, 'homie_kiss');
        await channel.send(`${alertEmoji} Wee woo, come here criminal ${kissEmoji} ${alertEmoji}`);
        break;
      }
      case 'hdafro': {
        await message.delete();
        await channel.send(
          'https://cdn.discordapp.com/attachments/889971045044457524/963498440753565776/s9olryMU_400x400.jpg'
        );
        break;
      }
      case 'smluis': {
        await message.delete();
        await channel.send(
          'https://cdn.discordapp.com/attachments/889971045044457524/964331065265246258/unknown.png'
        );
        break;
      }
    }
  }
};

export default messageCreate;
