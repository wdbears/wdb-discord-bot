import { Client, Intents, Collection } from 'discord.js';

export default class CustomClient extends Client {
  commands: Collection<string, string>;
  queue: Map<string, string>;
  config: Object;

  constructor() {
    super({ intents: [Intents.FLAGS.GUILDS] });
    this.commands = new Collection();
    this.queue = new Map();
    this.config = {};
  }
}
