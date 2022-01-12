import { Message } from 'discord.js';
import IEvent from '../models/IEvent';

const messageCreate: IEvent = {
  name: 'messageCreate',
  once: false,
  execute: async (message: Message) => {
    const channel = message.channel;
    if (!message.author.bot) {
      if (message.content === '!guard') {
        await message.delete();
        await channel.send('GUARD THE TOWER!');
      }
      if (
        message.content.includes('should') ||
        message.content.includes('could') ||
        message.content.includes('would')
      ) {
        await message.react('930619574657904660');
      }
      if (message.content === 'afro') {
        await channel.send(':afro:');
      }
    }
  }
};

export default messageCreate;
