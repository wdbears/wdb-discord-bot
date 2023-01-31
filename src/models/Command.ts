import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandBuilder
} from 'discord.js';

export interface ICommand {
  name: string;
  description: string;
  isEnabled: boolean;
  isGlobal?: boolean; // when false, the command is guild specific
  data?:
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export class Command {
  name: string;
  description: string;
  isEnabled: boolean;
  isGlobal: boolean;
  data:
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;

  constructor(cmd: ICommand) {
    this.name = cmd.name;
    this.description = cmd.description;
    this.isEnabled = cmd.isEnabled;
    this.isGlobal = cmd.isGlobal || true;
    this.data = cmd.data || new SlashCommandBuilder();
    this.data.setName(this.name).setDescription(this.description);
    if (this.data instanceof SlashCommandBuilder) {
      this.data.setDefaultMemberPermissions(this.isEnabled ? 1 : 0);
    }
    this.execute = cmd.execute;
  }
}
