import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'

export interface ICommand {
  name: string
  description: string
  usage: string
  aliases: string[]
  isEnabled?: boolean
  isGlobal: boolean // when false, the command is guild specific
  argsRequired: boolean
  cooldown: number
  data?: SlashCommandBuilder
  execute(interaction: CommandInteraction): Promise<void>
}

export class Command {
  name: string
  description: string
  usage: string
  aliases: string[]
  isEnabled: boolean
  isGlobal: boolean
  argsRequired: boolean
  cooldown: number
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction<CacheType>) => Promise<void>

  constructor(cmd: ICommand) {
    this.name = cmd.name
    this.description = cmd.description
    this.usage = cmd.usage
    this.aliases = cmd.aliases
    this.isEnabled = cmd.isEnabled || true
    this.isGlobal = cmd.isGlobal
    this.argsRequired = cmd.argsRequired
    this.cooldown = cmd.cooldown

    if (cmd.data) {
      this.data = cmd.data
        .setName(this.name)
        .setDescription(this.description)
        .setDefaultPermission(this.isEnabled)
    } else {
      this.data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .setDefaultPermission(this.isEnabled)
    }

    this.execute = cmd.execute
  }
}
