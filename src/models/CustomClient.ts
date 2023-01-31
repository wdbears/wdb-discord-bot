import { Client, Collection, IntentsBitField } from 'discord.js';
import { Command } from './Command';

export default class CustomClient extends Client {
  commands: Collection<string, Command>;
  queue: Map<string, string>;
  config: Record<string, never>;

  constructor() {
    const intents = new IntentsBitField();
    intents.add(
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMessageReactions,
      IntentsBitField.Flags.MessageContent
    );

    super({ intents });

    this.commands = new Collection();
    this.queue = new Map();
    this.config = {};
  }
}
