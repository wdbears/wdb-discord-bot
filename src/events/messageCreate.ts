import { Message } from 'discord.js';
import IEvent from '../models/IEvent';

const messageCreate: IEvent = {
  name: 'messageCreate',
  once: false,
  execute: async (message: Message) => {
    const channel = message.channel;
    const msgContent = message.content.toLowerCase();

    if (message.author.bot) return;

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
        await channel.send('<:afro:913940633931108372>');
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
