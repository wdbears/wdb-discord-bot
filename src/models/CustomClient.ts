import { Client, Intents, Collection, Interaction } from 'discord.js';
import { Command } from './Command';

export default class CustomClient extends Client {
  commands: Collection<string, Command>;
  queue: Map<string, string>;
  config: Record<string, never>;
  interactionCreate!: [client: CustomClient, interaction: Interaction];

  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      ]
    });
    this.commands = new Collection();
    this.queue = new Map();
    this.config = {};
  }
}