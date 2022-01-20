import 'dotenv/config';
import { Message } from 'discord.js';
import IEvent from '../models/IEvent';

const isProd = process.env['NODE_ENV'] === 'production';
const DEVELOPER_USER_ID = isProd ? undefined : process.env['DEVELOPER_USER_ID']!;

const messageCreate: IEvent = {
  name: 'messageCreate',
  once: false,
  execute: async (message: Message) => {
    const channel = message.channel;
    const msgAuthor = message.author;
    const msgAuthorDisplayName = message.member?.displayName;
    const msgContent = message.content.toLowerCase();

    if (msgAuthor.bot) return;
    if (DEVELOPER_USER_ID !== undefined && DEVELOPER_USER_ID !== msgAuthor.id) return;

    switch (msgContent) {
      case '!guard': {
        await message.delete();
        await channel.send('GUARD THE TOWER!');
        break;
      }
      case 'afroact': {
        await message.delete();
        channel.messages.fetch({ limit: 1 }).then((messages) => {
          const lastMessage = messages.first();
          if (lastMessage && !lastMessage.author.bot) {
            channel.lastMessage?.react('<:afro:913940633931108372>');
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
      }
    }
  }
};

export default messageCreate;
