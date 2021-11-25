import { Message } from 'discord.js';
import IEvent from '../models/IEvent';

const messageCreate: IEvent = {
  name: 'messageCreate',
  once: false,
  execute: async (message: Message) => {
    if (!message.author.bot) {
    }
  }
};

export default messageCreate;
