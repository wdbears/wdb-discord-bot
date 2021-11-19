import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface Command {
  name: string;
  description: string;
  usage: string;
  aliases: string[];
  cooldown: number;
  argsRequired: boolean;

  execute(interaction: CommandInteraction): void;
}

class BuiltCommand extends SlashCommandBuilder {
  usage: string;
  aliases: string[];
  cooldown: number;
  argsRequired: boolean;

  constructor(cmd: Command) {
    super();
    this.setName(cmd.name);
    this.setDescription(cmd.description);
    this.usage = cmd.usage;
    this.aliases = cmd.aliases;
    this.cooldown = cmd.cooldown;
    this.argsRequired = cmd.argsRequired;
  }
}
