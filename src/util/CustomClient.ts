import { Client, Intents, Collection } from 'discord.js';
import { Command } from './Command';

export default class CustomClient extends Client {
  commands: Collection<string, Command>;
  queue: Map<string, string>;
  config: Object;

  constructor() {
    super({ intents: [Intents.FLAGS.GUILDS] });
    this.commands = new Collection();
    this.queue = new Map();
    this.config = {};
  }
}
