import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, CacheType, TextChannel } from 'discord.js'
import { ICommand, Command } from '../models/Command'

const wait = require('util').promisify(setTimeout)

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
    if (amount < 1 || amount > 100) throw new Error(`please input a number between 1 and 99`)

    try {
      const channel = interaction.channel as TextChannel
      await channel
        .bulkDelete(amount, true)
        .then((messages) => interaction.reply(`Successfully deleted ${messages.size} messages!`))
      await wait(4000)
      await interaction.deleteReply()
    } catch (error) {
      console.log(error)
    }
  }
}

export default new Command(prune)
