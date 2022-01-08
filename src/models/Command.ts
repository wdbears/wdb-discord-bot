import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface ICommand {
  name: string;
  description: string;
  isEnabled?: boolean;
  isGlobal?: boolean; // when false, the command is guild specific
  data?: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute(interaction: CommandInteraction): Promise<void>;
}

export class Command {
  name: string;
  description: string;
  isEnabled: boolean;
  isGlobal: boolean;
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: CommandInteraction) => Promise<void>;

  constructor(cmd: ICommand) {
    this.name = cmd.name;
    this.description = cmd.description;
    this.isEnabled = cmd.isEnabled || true;
    this.isGlobal = cmd.isGlobal || true;
    this.data = cmd.data ? cmd.data : new SlashCommandBuilder();
    this.data
      .setName(this.name)
      .setDescription(this.description)
      .setDefaultPermission(this.isEnabled);
    this.execute = cmd.execute;
  }
}
