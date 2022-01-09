import { CommandInteraction } from 'discord.js';
import { Command, ICommand } from '../models/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { parseTime } from '../helpers/time';

const remind: ICommand = {
  name: 'remind',
  description: 'sends a reminder ping for a specified interval',
  data: new SlashCommandBuilder()
    .addStringOption((option) =>
      option
        .setName('event')
        .setDescription('Event name for which reminder is for')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('time').setDescription('Time for which reminder is set for').setRequired(true)
    ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    const eventName = interaction.options.getString('event');
    const userInputtedTime = interaction.options.getString('time');

    try {
      const time: Date = parseTime(userInputtedTime!);
      queueReminder(interaction, time);
      await interaction.reply(`${eventName} reminder is set for ${time.toLocaleString()}`);
    } catch (e: unknown) {
      if (e instanceof Error) {
        await interaction.reply(e.message);
      }
    }
  }
};

const queueReminder = (interaction: CommandInteraction, time: Date) => {
  const channel = interaction.channel;
  const currentTime = new Date().getTime();
  const alertTime = time.getTime();

  if (alertTime < currentTime) {
    throw new Error('Reminder time cannot be before current time!');
  }

  setTimeout(() => {
    channel!.send(`@everyone`);
  }, alertTime - currentTime);
};

export default new Command(remind);
