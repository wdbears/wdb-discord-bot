import { Message } from 'discord.js';
import IEvent from '../models/IEvent';

const messageCreate: IEvent = {
  name: 'messageCreate',
  once: false,
  execute: async (message: Message) => {
    if (!message.author.bot) {
      if (message.content === '!guard') {
        const channel = message.channel;
        await message.delete();
        await channel.send('GUARD THE TOWER!');
      }
    }
  }
};

export default messageCreate;
