import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, CacheType } from 'discord.js'
import { ICommand, Command } from '../models/Command'

let prune: ICommand = {
  name: 'prune',
  description: 'Delete the specified number of messages.',
  usage: '[Number]',
  aliases: ['clear'],
  isGlobal: true,
  argsRequired: true,
  cooldown: 0,
  data: new SlashCommandBuilder().addIntegerOption((option) =>
    option.setName('amount').setDescription('amount of messages to be deleted').setRequired(true)
  ),
  execute: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    const amount = interaction.options.getInteger('amount')!

    if (Number.isNaN(amount)) throw new Error(`${amount} is an invalid number`)
    if (amount <= 1 || amount > 100) throw new Error(`please input a number between 1 and 99`)

    try {
      interaction.channel!.bulkDelete(4)
      const message = await interaction.channel!.send(
        `Successfully deleted ${amount - 1} messages!`
      )

      setTimeout(() => message.delete(), 5000)
    } catch (error) {
      console.log(error)
    }
  }
}

export default new Command(prune)
