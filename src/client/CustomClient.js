import { Client, Collection } from 'discord.js';

export default class CustomClient extends Client {
  constructor(config) {
    super({
      disableEveryone: true,
      disabledEvents: ['TYPING_START']
    });

    this.commands = new Collection();
    this.queue = new Map();
    this.config = config;
  }
}
