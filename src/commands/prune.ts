import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType, TextChannel } from 'discord.js';
import { ICommand, Command } from '../models/Command';
import { wait } from '../util';

const prune: ICommand = {
  name: 'prune',
  description: 'Delete the specified number of messages.',
  data: new SlashCommandBuilder().addIntegerOption((option) =>
    option.setName('amount').setDescription('the number of messages to delete').setRequired(true)
  ),
  execute: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
    const amount = interaction.options.getInteger('amount')!;

    if (Number.isNaN(amount)) throw new Error(`${amount} is an invalid number`);
    if (amount < 1 || amount > 100) throw new Error(`please input a number between 1 and 99`);

    try {
      // Fetch channel and delete user-specified amount of messages
      const channel = interaction.channel as TextChannel;
      await channel
        .bulkDelete(amount, true)
        .then((messages) => interaction.reply(`Successfully deleted ${messages.size} messages!`));

      // Delete reply after 3 seconds
      await wait(3000);
      await interaction.deleteReply();
    } catch (error) {
      console.log(error);
    }
  }
};

export default new Command(prune);
