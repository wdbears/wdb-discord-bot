import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from 'discord.js';

export interface ICommand {
  name: string;
  description: string;
  isEnabled?: boolean;
  usage: string;
  aliases: string[];
  cooldown: number;
  argsRequired: boolean;
  execute(interaction: CommandInteraction): Promise<void>;
}

export class Command {
  name: string;
  description: string;
  isEnabled: boolean;
  usage: string;
  aliases: string[];
  cooldown: number;
  argsRequired: boolean;
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;

  constructor(cmd: ICommand) {
    this.name = cmd.name;
    this.description = cmd.description;
    this.isEnabled = cmd.isEnabled || true;
    this.usage = cmd.usage;
    this.aliases = cmd.aliases;
    this.cooldown = cmd.cooldown;
    this.argsRequired = cmd.argsRequired;
    this.data = new SlashCommandBuilder().setName(this.name).setDescription(this.description).setDefaultPermission(this.isEnabled);
    this.execute = cmd.execute;
  }
}
