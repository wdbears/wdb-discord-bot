// import 'dotenv/config';
import { Message } from 'discord.js';
import IEvent from '../models/IEvent';

const messageCreate: IEvent = {
  name: 'messageCreate',
  once: false,
  execute: async (message: Message) => {
    const channel = message.channel;
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
        await channel.messages.fetch({ limit: 1 }).then((messages) => {
          const lastMessage = messages.first();
          if (lastMessage && !lastMessage.author.bot) {
            const reactionEmoji = lastMessage.guild?.emojis.cache.find(
              (emoji) => emoji.name === 'afro'
            );
            if (reactionEmoji != undefined) lastMessage.react(reactionEmoji);
          }
        });
        break;
      }
      case 'afro': {
        await message.delete();
        const afroEmoji = message.guild?.emojis.cache.find((emoji) => emoji.name === 'afro');
        await channel.send(`${msgAuthorDisplayName} ${afroEmoji}'s you.`);
        break;
      }
      case 'police': {
        await message.delete();
        await channel.send(
          '<a:alert:930842484580446225> Wee woo, come here criminal <:homie_kiss:735213862453903421> <a:alert:930842484580446225>'
        );
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
